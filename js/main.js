/* ==========================================================================
   THE DANTE'S INFERNO — Main Controller
   Lenis + GSAP ScrollTrigger, preloader, hero, marquee, manifesto, band,
   records, nine circles, listen, cursor, gyroscope, tilt, magnetic, scramble.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= DATA ================= */
  var MEMBERS = [
    { num: "I",   name: "Dante Newcombe-Kenealy", role: "Drums",        glyph: "i-drum",   bio: "Bandleader and the name on the door. Dante NK drives the descent from behind the kit." },
    { num: "II",  name: "Adrian Riachta",         role: "Guitar",       glyph: "i-guitar", bio: "Six strings of fire. Composed \u201cSlow Nona\u201d on Grid Failure." },
    { num: "III", name: "Benji Baumewerd",        role: "Bass",         glyph: "i-bass",   bio: "The low end that keeps the ninth circle shaking." },
    { num: "IV",  name: "Louie Zong",             role: "Keys \u00b7 Synth", glyph: "i-keys", bio: "Emmy-nominated animator & musician. Synths from the other side. Composed \u201cBreaker Box\u201d & \u201cNeutron Star.\u201d" }
  ];

  var ALBUMS = [
    {
      id: "deal-with-the-devil", title: "Deal With the Devil", year: "2025",
      date: "December 1, 2025", cover: "images/cover-deal-with-the-devil.jpg",
      note: "The final descent. Six songs, straight to the point.",
      credits: "Dante Newcombe-Kenealy \u2014 Drums \u00b7 Adrian Riachta \u2014 Guitar \u00b7 Benji Baumewerd \u2014 Bass \u00b7 Louie Zong \u2014 Keys.",
      bandcamp: "https://tdantesinferno.bandcamp.com/album/deal-with-the-devil",
      spotify: "https://open.spotify.com/album/4jYvmYKoTEuG3QTdG6CeE5",
      embed: "https://open.spotify.com/embed/album/4jYvmYKoTEuG3QTdG6CeE5?utm_source=generator&theme=0",
      playerHeight: 352,
      tracks: [
        ["Spontaneous Combustion", "5:38"],
        ["Magnanimous", "8:08"],
        ["Interlude (Deal With the Devil)", "6:40"],
        ["Case Closed", "6:40"],
        ["Promethium", "6:16"],
        ["Vet Emergency (Louie's Wrapped Up)", "6:13"]
      ]
    },
    {
      id: "descent", title: "Descent", year: "2025",
      date: "August 21, 2025", cover: "images/cover-descent.jpg",
      note: "Recorded live with overdubs at the Vintage Synth Museum, Highland Park, LA.",
      credits: "Featuring John McGrath (tenor sax), Andrew Summerfield (alto sax), Kaipo Lee (EWI).",
      bandcamp: "https://tdantesinferno.bandcamp.com/album/descent",
      spotify: "https://open.spotify.com/album/2EIgIgobSYHYgNVxgYgBKk",
      embed: "https://open.spotify.com/embed/album/2EIgIgobSYHYgNVxgYgBKk?utm_source=generator&theme=0",
      playerHeight: 352,
      tracks: [
        ["Descent", "3:34"],
        ["Anticipation (feat. John McGrath)", "8:42"],
        ["These Demons That Surround Me", "7:51"],
        ["River Styx (feat. Andrew Summerfield)", "4:40"],
        ["Level 5", "6:24"],
        ["Kick Rocks (feat. Kaipo Lee)", "6:24"]
      ]
    },
    {
      id: "grid-failure", title: "Grid Failure", year: "2025",
      date: "September 30, 2025", cover: "images/cover-grid-failure.jpg",
      note: "When the system goes down\u2026 where will you be?",
      credits: "Gas Gamer, Sub-Surface & Troubleshooting composed by Dante. Slow Nona by Adrian. Breaker Box & Neutron Star by Louie.",
      bandcamp: "https://tdantesinferno.bandcamp.com/album/grid-failure",
      embed: "https://bandcamp.com/EmbeddedPlayer/album=3982058973/size=large/bgcol=0a0503/linkcol=ff5a1f/tracklist=false/artwork=small/transparent=true/",
      playerHeight: 120,
      tracks: [
        ["Troubleshooting", "4:22"],
        ["Breaker Box", "6:40"],
        ["Sub-Surface", "7:49"],
        ["Neutron Star", "5:22"],
        ["Slow Nona", "9:01"],
        ["Gas Gamer", "6:44"]
      ]
    }
  ];

  var CIRCLES = [
    { tag: "Circle I",   name: "Limbo",      latin: "i limbi",         desc: "Before the first note \u2014 the silence that isn't silence. Where unfinished ideas wait for the downbeat." },
    { tag: "Circle II",  name: "Lust",       latin: "i lussuriosi",    desc: "The groove. The pocket. The thing you can't help but move to." },
    { tag: "Circle III", name: "Gluttony",   latin: "i golosi",        desc: "Overdrive and fuzz. More notes than a song should ever hold." },
    { tag: "Circle IV",  name: "Greed",      latin: "gli avari",       desc: "The solo \u2014 four bars that always want eight more." },
    { tag: "Circle V",   name: "Anger",      latin: "gli iracondi",    desc: "The drums. Skins struck like a verdict." },
    { tag: "Circle VI",  name: "Heresy",     latin: "gli eretici",     desc: "Jazz that refuses to stay jazz. Funk that won't behave." },
    { tag: "Circle VII", name: "Violence",   latin: "i violenti",      desc: "The breakdown \u2014 the moment the room catches fire." },
    { tag: "Circle VIII",name: "Fraud",      latin: "i fraudolenti",   desc: "The fake ending. It wasn't over." },
    { tag: "Circle IX",  name: "Treachery",  latin: "i traditori",     desc: "The Deal With the Devil \u2014 the album, and the final descent." }
  ];

  /* ================= RENDER ================= */
  function renderMembers() {
    var grid = document.getElementById("bandGrid");
    grid.innerHTML = MEMBERS.map(function (m) {
      return '<div class="member" data-tilt>' +
        '<span class="member__num">' + m.num + '</span>' +
        '<span class="member__glyph"><svg class="icon"><use href="#' + m.glyph + '"></use></svg></span>' +
        '<div class="member__name">' + m.name + '</div>' +
        '<span class="member__role">' + m.role + '</span>' +
        '<p class="member__bio">' + m.bio + '</p>' +
      '</div>';
    }).join("");
    initTilt(document.querySelectorAll(".member"));
    initGlow(document.querySelectorAll(".member"));
  }

  function renderRecords() {
    var list = document.getElementById("recordsList");
    list.innerHTML = ALBUMS.map(function (a, i) {
      return '<article class="record" data-album="' + a.id + '">' +
        '<div class="record__stage"><div class="record__wrap" data-tilt3d>' +
          '<div class="record__cover" role="button" tabindex="0" aria-label="Open ' + a.title + '">' +
            '<img src="' + a.cover + '" alt="' + a.title + ' cover" loading="lazy">' +
            '<div class="record__play"><span class="record__play-btn"><svg class="icon"><use href="#i-play"></use></svg></span></div>' +
          '</div>' +
          '<div class="record__vinyl" aria-hidden="true"></div>' +
        '</div></div>' +
        '<div class="record__meta">' +
          '<span class="record__idx">0' + (i + 1) + ' \u00b7 ' + a.year + '</span>' +
          '<h3 class="record__title">' + a.title + '</h3>' +
          '<span class="record__date">' + a.date + '</span>' +
        '</div>' +
      '</article>';
    }).join("");

    list.querySelectorAll(".record").forEach(function (r) {
      var cover = r.querySelector(".record__cover");
      var open = function () { openModal(r.getAttribute("data-album")); };
      cover.addEventListener("click", open);
      cover.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    initTilt3d(list.querySelectorAll("[data-tilt3d]"));
  }

  function renderCircles() {
    var track = document.getElementById("circlesTrack");
    track.innerHTML = CIRCLES.map(function (c) {
      return '<div class="circle">' +
        '<span class="circle__num">' + c.tag.replace("Circle ", "") + '</span>' +
        '<div class="circle__content"><div class="circle__inner">' +
          '<span class="circle__tag">' + c.tag + '</span>' +
          '<h3 class="circle__name">' + c.name + '</h3>' +
          '<span class="circle__latin">' + c.latin + '</span>' +
          '<p class="circle__desc">' + c.desc + '</p>' +
        '</div></div>' +
      '</div>';
    }).join("");
  }

  function renderListenTabs() {
    // default player
    showEmbed(ALBUMS[0]);
  }

  function showEmbed(album) {
    var wrap = document.getElementById("listenEmbed");
    var h = album.playerHeight || 352;
    wrap.innerHTML = '<iframe src="' + album.embed + '" loading="lazy" style="height:' + h + 'px" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  }

  function openModal(id) {
    var album = ALBUMS.filter(function (a) { return a.id === id; })[0];
    if (!album) return;
    var modal = document.getElementById("albumModal");
    document.getElementById("modalCover").innerHTML = '<img src="' + album.cover + '" alt="' + album.title + ' cover">';
    document.getElementById("modalTitle").textContent = album.title;
    document.getElementById("modalLabel").textContent = "The Dante's Inferno \u00b7 " + album.year;
    document.getElementById("modalDate").textContent = "Released " + album.date;
    document.getElementById("modalNote").textContent = album.note;
    document.getElementById("modalTracks").innerHTML = album.tracks.map(function (t, i) {
      return '<li><span class="t-no">' + (i + 1) + '</span><span class="t-name">' + t[0] + '</span><span class="t-dur">' + t[1] + '</span></li>';
    }).join("");
    document.getElementById("modalCredits").textContent = album.credits;
    var links = document.getElementById("modalLinks");
    links.innerHTML = '<a class="btn" href="' + album.bandcamp + '" target="_blank" rel="noopener">Bandcamp <svg class="icon"><use href="#i-bandcamp"></use></svg></a>';
    if (album.spotify) {
      links.innerHTML += '<a class="btn btn--ghost" href="' + album.spotify + '" target="_blank" rel="noopener">Spotify <svg class="icon"><use href="#i-spotify"></use></svg></a>';
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    var modal = document.getElementById("albumModal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (window.lenis) window.lenis.start();
    document.body.style.overflow = "";
  }

  /* ================= TILT / GLOW ================= */
  function initGlow(els) {
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  function initTilt(els) {
    if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
        el.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  function initTilt3d(els) {
    if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -16;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 16;
        el.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ================= CURSOR ================= */
  function initCursor() {
    var fine = window.matchMedia("(pointer: fine)").matches && !prefersReduced;
    if (!fine) return;
    document.body.classList.add("has-cursor");
    var cursor = document.querySelector(".cursor");
    var dot = cursor.querySelector(".cursor__dot");
    var ring = cursor.querySelector(".cursor__ring");
    var label = cursor.querySelector(".cursor__label");
    var dx = 0, dy = 0, rx = 0, ry = 0;
    var px = 0, py = 0;

    window.addEventListener("mousemove", function (e) {
      px = e.clientX; py = e.clientY;
      dot.style.transform = "translate(" + px + "px," + py + "px) translate(-50%,-50%)";
      if (window.Sparks) window.Sparks.move(px, py, Math.hypot(e.movementX || 0, e.movementY || 0));
      if (window.FireEngine) window.FireEngine.setPointer(e.clientX / innerWidth, e.clientY / innerHeight);
    }, { passive: true });

    function loop() {
      dx += (px - dx) * 0.16;
      dy += (py - dy) * 0.16;
      rx += (px - rx) * 0.09;
      ry += (py - ry) * 0.09;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    loop();

    var hoverables = document.querySelectorAll("a, button, .record__cover, [data-tilt], [data-magnetic]");
    hoverables.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-hover");
        var txt = el.getAttribute("data-cursor") || el.getAttribute("data-scramble");
        if (txt && (el.tagName === "A" || el.tagName === "BUTTON")) { label.textContent = txt; }
      });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
    });
    document.addEventListener("mousedown", function () { cursor.classList.add("is-down"); });
    document.addEventListener("mouseup", function () { cursor.classList.remove("is-down"); });
  }

  /* ================= MAGNETIC ================= */
  function initMagnetic() {
    if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.35;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ================= GYROSCOPE ================= */
  function initGyroscope() {
    if (typeof DeviceOrientationEvent === "undefined") return;
    var target = { x: 0, y: 0 };
    var cur = { x: 0, y: 0 };
    window.addEventListener("deviceorientation", function (e) {
      if (e.gamma == null || e.beta == null) return;
      target.y = (e.gamma / 45) * 0.5;
      target.x = ((e.beta - 45) / 45) * 0.5;
    }, { passive: true });
    var layers = document.querySelectorAll("[data-depth]");
    function gyroLoop() {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute("data-depth")) || 0.5;
        l.style.transform = "translate3d(" + (cur.x * 60 * d) + "px," + (cur.y * 60 * d) + "px,0)";
      });
      if (window.FireEngine && Math.abs(cur.x) + Math.abs(cur.y) > 0.001) {
        window.FireEngine.setPointer(0.5 + cur.x, 0.55 + cur.y);
      }
      requestAnimationFrame(gyroLoop);
    }
    gyroLoop();
  }

  /* ================= TEXT SCRAMBLE ================= */
  function initScramble() {
    var glyphs = "!<>-_\\/[]{}#@%&=+*?^";
    document.querySelectorAll("[data-scramble]").forEach(function (el) {
      var original = el.textContent;
      el.addEventListener("mouseenter", function () {
        var frame = 0;
        var interval = setInterval(function () {
          el.textContent = original.split("").map(function (ch, i) {
            if (ch === " ") return ch;
            if (i < frame) return original[i];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          }).join("");
          frame++;
          if (frame > original.length) { clearInterval(interval); el.textContent = original; }
        }, 28);
        el._scrambleInt = interval;
      });
      el.addEventListener("mouseleave", function () {
        if (el._scrambleInt) clearInterval(el._scrambleInt);
        el.textContent = original;
      });
    });
  }

  /* ================= SPLIT TEXT ================= */
  function splitChars(el) {
    var text = el.textContent;
    el.innerHTML = "";
    el.setAttribute("aria-label", text);
    for (var i = 0; i < text.length; i++) {
      var ch = text[i] === " " ? "&nbsp;" : text[i];
      var span = document.createElement("span");
      span.className = "ch";
      span.innerHTML = ch;
      el.appendChild(span);
    }
    return el.querySelectorAll(".ch");
  }

  /* ================= PRELOADER ================= */
  function initPreloader() {
    var pre = document.getElementById("preloader");
    var rings = pre.querySelectorAll(".pre__ring");
    var circles = pre.querySelectorAll(".pre__circles span");
    var count = document.getElementById("preCount");
    var bar = document.getElementById("preBar");
    var done = false;

    var obj = { v: 0 };
    var tl = gsap.timeline({
      onComplete: finish
    });
    tl.to(obj, {
      v: 100, duration: 2.4, ease: "power2.inOut",
      onUpdate: function () {
        var v = Math.floor(obj.v);
        count.textContent = String(v).padStart(2, "0");
        bar.style.width = v + "%";
        var lit = Math.floor(v / 100 * rings.length);
        rings.forEach(function (r, i) { r.classList.toggle("is-on", i < lit); });
        circles.forEach(function (c, i) { c.classList.toggle("is-on", i < lit); });
      }
    });

    function finish() {
      if (done) return;
      done = true;
      gsap.to(pre, {
        opacity: 0, duration: 0.6, ease: "power2.inOut",
        onComplete: function () {
          pre.style.display = "none";
          playHero();
        }
      });
    }

    // safety: never trap the user
    setTimeout(finish, 6000);
  }

  function prepareHero() {
    var lines = document.querySelectorAll(".hero__line");
    lines.forEach(function (line) {
      line._chs = splitChars(line);
      gsap.set(line._chs, { yPercent: 120, opacity: 0 });
    });
    var kicker = document.querySelector(".hero__kicker");
    kicker._chs = splitChars(kicker);
    gsap.set(kicker._chs, { opacity: 0, y: 12 });
    gsap.set(".hero__sub", { opacity: 0, y: 20 });
    gsap.set(".hero__meta", { opacity: 0 });
    gsap.set(".hero__scroll", { opacity: 0 });
    var footer = document.querySelector(".footer__wm-line");
    footer._chs = splitChars(footer);
  }

  function playHero() {
    var lines = document.querySelectorAll(".hero__line");
    lines.forEach(function (line, li) {
      gsap.to(line._chs, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.035, delay: li * 0.06 });
      flickerChars(line._chs);
    });
    var kicker = document.querySelector(".hero__kicker");
    gsap.to(kicker._chs, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: "power2.out" });
    gsap.to(".hero__sub", { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" });
    gsap.to(".hero__meta", { opacity: 1, duration: 0.8, delay: 0.6 });
    gsap.to(".hero__scroll", { opacity: 1, duration: 0.6, delay: 0.9 });
    flickerChars(document.querySelector(".footer__wm-line")._chs);
  }

  function flickerChars(chs) {
    if (prefersReduced) return;
    chs.forEach(function (ch) {
      gsap.to(ch, {
        scale: gsap.utils.random(0.94, 1.04),
        duration: gsap.utils.random(0.4, 1.3),
        repeat: -1, yoyo: true, ease: "sine.inOut",
        delay: gsap.utils.random(0, 2)
      });
    });
  }

  /* ================= MARQUEE ================= */
  function initMarquee() {
    var track = document.getElementById("marqueeTrack");
    track.innerHTML += track.innerHTML;
    var tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
    track.addEventListener("mouseenter", function () { gsap.to(tween, { timeScale: 2.5, duration: 0.4 }); });
    track.addEventListener("mouseleave", function () { gsap.to(tween, { timeScale: 1, duration: 0.4 }); });
  }

  /* ================= SCROLL REVEALS ================= */
  function initReveals() {
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // manifesto word-by-word
    gsap.utils.toArray(".manifesto__body").forEach(function (p) {
      var words = p.querySelectorAll(".w");
      gsap.fromTo(words, { opacity: 0.1, y: 8 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: "none",
        scrollTrigger: { trigger: p, start: "top 80%" }
      });
    });
    var leadWords = document.querySelectorAll(".manifesto__lead .w");
    gsap.fromTo(leadWords, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ".manifesto__lead", start: "top 80%" }
    });
  }

  /* ================= NINE CIRCLES ================= */
  function initCircles() {
    var section = document.getElementById("circles");
    var track = document.getElementById("circlesTrack");
    var depth = document.getElementById("depth");
    var depthFill = document.getElementById("depthFill");
    var depthVal = document.getElementById("depthVal");
    var circles = track.querySelectorAll(".circle");

    var getDist = function () { return track.scrollWidth - window.innerWidth; };

    var tween = gsap.to(track, {
      x: function () { return -getDist(); },
      ease: "none",
      scrollTrigger: {
        trigger: section, pin: true, scrub: 1, anticipatePin: 1,
        end: function () { return "+=" + getDist(); },
        invalidateOnRefresh: true,
        onEnter: function () { depth.classList.add("is-visible"); },
        onLeaveBack: function () { depth.classList.remove("is-visible"); },
        onUpdate: function (self) {
          var p = self.progress;
          depthFill.style.height = (p * 100) + "%";
          depthVal.textContent = Math.round(p * 9) + " / 9";
          if (window.FireEngine) window.FireEngine.setIntensity(0.22 + p * 0.78);
          if (window.Embers) window.Embers.setIntensity(0.6 + p * 0.4);
          var i = Math.round(p * (circles.length - 1));
          if (i !== section._active) {
            section._active = i;
            gsap.fromTo(circles[i].querySelector(".circle__inner"),
              { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          }
        }
      }
    });

    window.addEventListener("resize", function () { ScrollTrigger.refresh(); });
  }

  /* ================= FIRE INTENSITY (global) ================= */
  function initFireScroll() {
    if (!window.FireEngine) return;
    gsap.to(window.FireEngine, {
      targetIntensity: 0.22, duration: 1, ease: "none",
      scrollTrigger: { trigger: "#manifesto", start: "top bottom", end: "top 20%", scrub: true }
    });
  }

  /* ================= LISTEN TABS ================= */
  function initListenTabs() {
    var tabs = document.querySelectorAll(".listen__tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var id = tab.getAttribute("data-album");
        var album = ALBUMS.filter(function (a) { return a.id === id; })[0];
        if (album) showEmbed(album);
      });
    });
  }

  /* ================= NAV ================= */
  function initNav() {
    var nav = document.getElementById("nav");
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > 400 && y > lastY) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
  }

  /* ================= SMOOTH SCROLL (Lenis) ================= */
  function initScroll() {
    if (prefersReduced || typeof Lenis === "undefined") return;
    var lenis = new Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.1 });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        }
      });
    });
  }

  /* ================= FALLBACK ================= */
  function fallback() {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("fallback-visible"); });
    var pre = document.getElementById("preloader");
    if (pre) pre.style.display = "none";
  }

  /* ================= BOOT ================= */
  function boot() {
    document.documentElement.classList.add("js");
    document.getElementById("year").textContent = new Date().getFullYear();
    renderMembers();
    renderRecords();
    renderCircles();
    renderListenTabs();

    // modal events (always available)
    document.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      fallback();
      initListenTabs();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    prepareHero();
    initScroll();
    initCursor();
    initMagnetic();
    initScramble();
    initGyroscope();
    initMarquee();
    initReveals();
    initCircles();
    initFireScroll();
    initListenTabs();
    initNav();
    initPreloader();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
