/* ==========================================================================
   THE DANTE'S INFERNO — Fire Engine
   WebGL inferno shader (fbm domain-warp) + ember particle sprites + cursor
   sparks. Self-contained, no external deps. Exposes:
     window.FireEngine.setIntensity(0..1)   — scroll-driven fire strength
     window.FireEngine.setPointer(x, y)      — normalized 0..1 pointer
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------- WebGL inferno ---------- */
  var FireEngine = {
    intensity: 0.55,
    targetIntensity: 0.55,
    pointer: { x: 0.5, y: 0.55 },
    _pointer: { x: 0.5, y: 0.55 },
    _running: false,
    _gl: null,
    _prog: null,
    _uRes: null, _uTime: null, _uInt: null, _uPtr: null,
    _canvas: null,
    _raf: 0,
    _start: 0,

    init: function () {
      var canvas = document.getElementById("fireWebGL");
      if (!canvas || prefersReduced) return;
      var gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
      if (!gl) return;
      this._gl = gl;
      this._canvas = canvas;

      var vert = [
        "attribute vec2 a_pos;",
        "void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }"
      ].join("\n");

      var frag = [
        "precision highp float;",
        "uniform vec2 u_res;",
        "uniform float u_time;",
        "uniform float u_intensity;",
        "uniform vec2 u_pointer;",
        "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }",
        "float noise(vec2 p){",
        "  vec2 i = floor(p); vec2 f = fract(p);",
        "  vec2 u = f*f*(3.0-2.0*f);",
        "  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),",
        "             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);",
        "}",
        "float fbm(vec2 p){",
        "  float v = 0.0; float a = 0.5;",
        "  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);",
        "  for(int i=0;i<5;i++){ v += a*noise(p); p = m*p; a *= 0.5; }",
        "  return v;",
        "}",
        "void main(){",
        "  vec2 uv = gl_FragCoord.xy / u_res.xy;",
        "  vec2 p = uv;",
        "  p.x *= u_res.x / u_res.y;",
        "  vec2 pm = u_pointer;",
        "  p.x += (pm.x - 0.5) * 0.4;",
        "  p.y += (pm.y - 0.5) * 0.25;",
        "  float t = u_time * 0.22;",
        "  p.y += t;",
        "  vec2 q = vec2(fbm(p*2.0), fbm(p*2.0 + vec2(5.2, 1.3)));",
        "  vec2 r = vec2(fbm(p + 2.4*q + vec2(1.7, 9.2)), fbm(p + 2.4*q + vec2(8.3, 2.8)));",
        "  float f = fbm(p + 2.4*r);",
        "  float shape = smoothstep(1.25, 0.05, uv.y) * (1.0 - smoothstep(0.0, 0.9, uv.y));",
        "  f = f * shape * 1.8;",
        "  f *= u_intensity;",
        "  vec3 col = vec3(0.0);",
        "  col = mix(col, vec3(0.30, 0.02, 0.00), smoothstep(0.00, 0.50, f));",
        "  col = mix(col, vec3(0.82, 0.10, 0.00), smoothstep(0.50, 0.68, f));",
        "  col = mix(col, vec3(1.00, 0.30, 0.02), smoothstep(0.68, 0.82, f));",
        "  col = mix(col, vec3(1.00, 0.64, 0.16), smoothstep(0.82, 0.92, f));",
        "  col = mix(col, vec3(1.00, 0.95, 0.62), smoothstep(0.92, 1.00, f));",
        "  float a = smoothstep(0.02, 0.4, f);",
        "  gl_FragColor = vec4(col, a * u_intensity);",
        "}"
      ].join("\n");

      function compile(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }
      var vs = compile(gl.VERTEX_SHADER, vert);
      var fs = compile(gl.FRAGMENT_SHADER, frag);
      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      this._prog = prog;
      this._uRes = gl.getUniformLocation(prog, "u_res");
      this._uTime = gl.getUniformLocation(prog, "u_time");
      this._uInt = gl.getUniformLocation(prog, "u_intensity");
      this._uPtr = gl.getUniformLocation(prog, "u_pointer");

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      this._resize();
      window.addEventListener("resize", this._resize.bind(this));
      this._start = performance.now();
      this._running = true;
      this._loop();
    },

    _resize: function () {
      var gl = this._gl;
      if (!gl) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.floor(window.innerWidth * dpr);
      var h = Math.floor(window.innerHeight * dpr);
      if (this._canvas.width !== w || this._canvas.height !== h) {
        this._canvas.width = w;
        this._canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    },

    _loop: function () {
      if (!this._running) return;
      var gl = this._gl;
      var t = (performance.now() - this._start) / 1000;
      this.intensity = lerp(this.intensity, this.targetIntensity, 0.05);
      this._pointer.x = lerp(this._pointer.x, this.pointer.x, 0.08);
      this._pointer.y = lerp(this._pointer.y, this.pointer.y, 0.08);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this._prog);
      gl.uniform2f(this._uRes, this._canvas.width, this._canvas.height);
      gl.uniform1f(this._uTime, t);
      gl.uniform1f(this._uInt, this.intensity);
      gl.uniform2f(this._uPtr, this._pointer.x, this._pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      this._raf = requestAnimationFrame(this._loop.bind(this));
    },

    setIntensity: function (v) { this.targetIntensity = clamp(v, 0, 1); },
    setPointer: function (x, y) { this.pointer.x = x; this.pointer.y = y; },

    destroy: function () {
      this._running = false;
      cancelAnimationFrame(this._raf);
    }
  };

  /* ---------- shared glow sprite ---------- */
  function makeSprite(color) {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, color);
    g.addColorStop(0.35, color.replace(/[\d.]+\)$/, "0.6)"));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return c;
  }

  /* ---------- ember particle field ---------- */
  var Embers = {
    _canvas: null, _ctx: null, _parts: [], _sprite: null, _running: false, _raf: 0,
    _w: 0, _h: 0, intensity: 1, _pointer: { x: 0.5, y: 0.5 },
    _count: 130,

    init: function () {
      var canvas = document.getElementById("embers");
      if (!canvas) return;
      this._canvas = canvas;
      this._ctx = canvas.getContext("2d");
      this._sprite = makeSprite("rgba(255, 130, 40, 1)");
      this._resize();
      window.addEventListener("resize", this._resize.bind(this));
      var self = this;
      for (var i = 0; i < this._count; i++) this._parts.push(self._make(true));
      this._running = true;
      this._loop();
    },

    _make: function (spread) {
      return {
        x: rand(0, this._w),
        y: spread ? rand(0, this._h) : this._h + rand(0, 40),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.7, -0.2),
        size: rand(1.2, 4.2),
        life: rand(0.4, 1.4),
        age: 0,
        phase: rand(0, Math.PI * 2),
        flicker: rand(0.05, 0.2)
      };
    },

    _resize: function () {
      this._w = this._canvas.width = window.innerWidth;
      this._h = this._canvas.height = window.innerHeight;
    },

    setPointer: function (x, y) { this._pointer.x = x; this._pointer.y = y; },
    setIntensity: function (v) { this.intensity = v; },

    _loop: function () {
      if (!this._running) return;
      var ctx = this._ctx;
      ctx.clearRect(0, 0, this._w, this._h);
      ctx.globalCompositeOperation = "lighter";
      var count = Math.floor(this._count * (0.4 + 0.6 * this.intensity));
      for (var i = 0; i < count; i++) {
        var p = this._parts[i];
        p.age += 0.016;
        p.x += p.vx + Math.sin(p.age * 3 + p.phase) * 0.3;
        p.y += p.vy;
        if (p.y < -20 || p.age > p.life) {
          var np = this._make(false);
          this._parts[i] = np;
          p = np;
        }
        var alpha = clamp(Math.sin((p.age / p.life) * Math.PI), 0, 1);
        var s = p.size * (0.7 + 0.5 * Math.sin(p.age * 8 + p.phase));
        ctx.globalAlpha = alpha * 0.9;
        ctx.drawImage(this._sprite, p.x - s * 2.2, p.y - s * 2.2, s * 4.4, s * 4.4);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      this._raf = requestAnimationFrame(this._loop.bind(this));
    },

    destroy: function () { this._running = false; cancelAnimationFrame(this._raf); }
  };

  /* ---------- cursor sparks ---------- */
  var Sparks = {
    _canvas: null, _ctx: null, _parts: [], _sprite: null, _running: false, _raf: 0,
    _w: 0, _h: 0, _px: 0, _py: 0, _hasPos: false, _lastEmit: 0,

    init: function () {
      var canvas = document.getElementById("cursorSpark");
      if (!canvas || prefersReduced) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      this._canvas = canvas;
      this._ctx = canvas.getContext("2d");
      this._sprite = makeSprite("rgba(255, 170, 60, 1)");
      this._resize();
      window.addEventListener("resize", this._resize.bind(this));
      this._running = true;
      this._loop();
    },

    _resize: function () {
      this._w = this._canvas.width = window.innerWidth;
      this._h = this._canvas.height = window.innerHeight;
    },

    move: function (x, y, speed) {
      if (!this._running) return;
      if (this._hasPos) {
        var now = performance.now();
        if (now - this._lastEmit > 18) {
          this._lastEmit = now;
          var n = Math.min(3, Math.floor(speed / 6));
          for (var i = 0; i < n; i++) {
            this._parts.push({
              x: x, y: y,
              vx: rand(-1.4, 1.4), vy: rand(-0.6, 1.4),
              size: rand(1, 3), life: rand(0.3, 0.7), age: 0
            });
          }
        }
      }
      this._px = x; this._py = y; this._hasPos = true;
    },

    _loop: function () {
      if (!this._running) return;
      var ctx = this._ctx;
      ctx.clearRect(0, 0, this._w, this._h);
      ctx.globalCompositeOperation = "lighter";
      for (var i = this._parts.length - 1; i >= 0; i--) {
        var p = this._parts[i];
        p.age += 0.016;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.12;
        if (p.age > p.life) { this._parts.splice(i, 1); continue; }
        var alpha = clamp(1 - p.age / p.life, 0, 1);
        var s = p.size * (1 - p.age / p.life);
        ctx.globalAlpha = alpha;
        ctx.drawImage(this._sprite, p.x - s * 2, p.y - s * 2, s * 4, s * 4);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      this._raf = requestAnimationFrame(this._loop.bind(this));
    },

    destroy: function () { this._running = false; cancelAnimationFrame(this._raf); }
  };

  /* ---------- boot ---------- */
  function boot() {
    if (prefersReduced) return;
    FireEngine.init();
    Embers.init();
    Sparks.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.FireEngine = FireEngine;
  window.Embers = Embers;
  window.Sparks = Sparks;
})();
