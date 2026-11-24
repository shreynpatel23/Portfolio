(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Static bits (always run) ---------- */
  $("#year").textContent = new Date().getFullYear();
  const clock = $("#clock");
  const tick = () => {
    clock.textContent =
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date()) + " IST";
  };
  tick();
  setInterval(tick, 30000);

  // QR pattern for the Rategate visual (finder squares + pseudo-random modules)
  const qr = $(".qr");
  if (qr) {
    // 3x3 corner "finder" blocks are solid; everything else is seeded noise.
    const inFinder = (r, c) =>
      (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++) {
        const i = document.createElement("i");
        if (!inFinder(r, c) && rnd() > 0.5) i.className = "o";
        qr.appendChild(i);
      }
  }

  // Cursor spotlight
  if (finePointer && !reduce) {
    addEventListener(
      "pointermove",
      (e) => {
        root.style.setProperty("--mx", e.clientX + "px");
        root.style.setProperty("--my", e.clientY + "px");
      },
      { passive: true }
    );
  }

  // Top bar: hidden while the page is scrolling, back as soon as scrolling stops
  const nav = $(".nav");
  let navTimer;
  addEventListener(
    "scroll",
    () => {
      if (scrollY > 200 && !nav.contains(document.activeElement)) nav.classList.add("is-hidden");
      clearTimeout(navTimer);
      navTimer = setTimeout(() => nav.classList.remove("is-hidden"), 180);
    },
    { passive: true }
  );

  // Active nav link
  const links = $$(".nav__links a");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["work", "approach", "experience", "contact"].forEach((id) => io.observe(document.getElementById(id)));

  if (reduce || !window.gsap) {
    root.classList.remove("js");
    // Final states without motion
    $$(".stars span").forEach((s, i) => i < 4 && s.classList.add("on"));
    return;
  }

  /* ---------- Motion ---------- */
  const { gsap, ScrollTrigger, SplitText } = window;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  window.__motionReady = true;

  // Smooth scroll on desktop only
  let lenis;
  if (finePointer && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        e.preventDefault();
        lenis.scrollTo(id === "#top" ? 0 : id, { offset: -20 });
      })
    );
  }

  // Scroll progress bar
  gsap.to(".progress span", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
  });

  document.fonts.ready.then(() => {
    /* Hero */
    const heroSplit = new SplitText(".hero__title .split", { type: "chars" });
    $(".hero__title .split").classList.add("is-split");
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(heroSplit.chars, { yPercent: 110, rotate: 6, duration: 1.2, stagger: 0.035 })
      .from(".hero__lede", { y: 30, opacity: 0, duration: 1 }, "-=0.8")
      .to(".hero .reveal-up", { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, "-=0.8")
      .from(".stat", { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
      .from(".orb", { scale: 0.6, opacity: 0, duration: 2 }, 0);

    // Hero parallax on scroll
    gsap.to(".hero__inner", {
      yPercent: -12,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".orb--a", {
      y: 160,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Rotating word
    const words = ["ship them.", "scale them.", "trust them."];
    const word = $(".rotator__word");
    let w = 0;
    setInterval(() => {
      w = (w + 1) % words.length;
      gsap
        .timeline()
        .to(word, { yPercent: -60, opacity: 0, duration: 0.35, ease: "power2.in" })
        .set(word, { textContent: words[w], yPercent: 60 })
        .to(word, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
    }, 2800);

    /* Section headings: line-by-line masked reveal */
    $$(".split-lines").forEach((el) => {
      // Words (not lines): line detection proved unreliable with this font + negative tracking.
      const split = new SplitText(el, { type: "words", mask: "words" });
      el.classList.add("is-split");
      gsap.from(split.words, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });

    /* Generic reveals outside the hero */
    ScrollTrigger.batch(".reveal-up:not(.hero .reveal-up)", {
      start: "top 88%",
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08 }),
    });

    /* Counters */
    $$(".count").forEach((el) => {
      const to = +el.dataset.to;
      const obj = { v: 0 };
      el.textContent = "0";
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: to,
            duration: 1.6,
            ease: "power3.out",
            onUpdate: () => (el.textContent = Math.round(obj.v)),
          }),
      });
    });

    /* Work cards */
    const cards = $$(".card");
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      // Each card shrinks and dims as the next one stacks over it
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // Go-back effect: the card shrinks and dims (overlay, not opacity) as the next one rises.
        // The 60vh gap between cards keeps each one at full brightness for a while first.
        gsap.to(card, {
          scale: 0.92,
          "--shade": 0.65,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top 85%",
            end: "top 96px",
            scrub: true,
          },
        });
      });
    });

    cards.forEach((card) => {
      const viz = $(".card__visual", card);
      const tlc = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 70%" },
        defaults: { ease: "expo.out" },
      });
      tlc
        .from($$(".card__text > *", card), { y: 30, opacity: 0, duration: 1, stagger: 0.06 })
        .from(viz, { clipPath: "inset(8% 8% 8% 8% round 16px)", opacity: 0, duration: 1.2 }, 0);

      // Per-visual details
      const bars = $$(".bar i, .feedback b, .stock__row i", card);
      const rows = $$(".stock__row", card);
      if (rows.length) tlc.from(rows, { x: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.2);
      bars.forEach((b, i) => {
        tlc.fromTo(b, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.2 }, 0.3 + i * 0.08);
      });
      const dial = $(".dial__fill", card);
      if (dial) tlc.fromTo(dial, { strokeDashoffset: 100 }, { strokeDashoffset: 28, duration: 1.8 }, 0.2);
      const heat = $$(".heat i", card);
      if (heat.length)
        tlc.from(heat, { scale: 0, opacity: 0, duration: 0.6, stagger: { each: 0.035, from: "start" } }, 0.3);
      const stars = $$(".stars span", card);
      if (stars.length)
        stars.forEach((s, i) => {
          if (i < 4)
            tlc.add(() => s.classList.add("on"), 0.5 + i * 0.15).from(
              s,
              { scale: 0.4, duration: 0.5, ease: "back.out(3)" },
              0.5 + i * 0.15
            );
        });
      const ev = $$(".cal i.e", card);
      if (ev.length) tlc.from(ev, { scaleY: 0, transformOrigin: "50% 0", duration: 0.7, stagger: 0.07 }, 0.3);
      const typing = $(".typing", card);
      if (typing) {
        const full = typing.textContent;
        typing.textContent = "";
        tlc.to(
          {},
          {
            duration: 1.8,
            ease: "none",
            onUpdate() {
              typing.textContent = full.slice(0, Math.round(this.progress() * full.length));
            },
          },
          0.8
        );
      }
      const msgs = $$(".msg, .copilot, .feedback", card);
      if (msgs.length) tlc.from(msgs, { y: 16, opacity: 0, duration: 0.7, stagger: 0.18 }, 0.2);
      const qrCells = $$(".qr i", card);
      if (qrCells.length) tlc.from(qrCells, { opacity: 0, duration: 0.3, stagger: { each: 0.006, from: "random" } }, 0.2);
    });

    /* Approach pipeline: connectors draw one after another as you scroll */
    gsap.fromTo(
      ".node__link",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: { trigger: ".pipeline", start: "top 70%", end: "top 35%", scrub: true },
      }
    );
    gsap.from(".node", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.15,
      scrollTrigger: { trigger: ".pipeline", start: "top 80%" },
    });

    /* Timeline line draws with scroll */
    gsap.to(".timeline__line span", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 70%", scrub: true },
    });
    $$(".role").forEach((role) =>
      gsap.from(role.children, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: role, start: "top 85%" },
      })
    );

    /* Rows */
    gsap.from(".row", {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".rows", start: "top 85%" },
    });
    gsap.from(".skills__row", {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: ".skills", start: "top 85%" },
    });

    ScrollTrigger.refresh();
  });

  /* Magnetic buttons */
  if (finePointer) {
    $$(".magnetic").forEach((el) => {
      // Subtle pull: at most 4px, so neighbouring buttons never overlap.
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      const cap = gsap.utils.clamp(-4, 4);
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo(cap((e.clientX - (r.left + r.width / 2)) * 0.06));
        yTo(cap((e.clientY - (r.top + r.height / 2)) * 0.1));
      });
      el.addEventListener("pointerleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }
})();
