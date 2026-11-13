/* =====================================================================
   HESEDCORP 홈 — 모션 & 인터랙션 (GSAP 3 + ScrollTrigger + Lenis)
   시안 design/motion.js 를 모듈로 이식. 차이점:
   - 헤더(스크롤 시 solid/숨김, 시계, 메뉴)는 Header.astro 가 담당
   - 푸터 리빌은 Footer.astro 가 담당
   - 커서·마그네틱·플로팅 프리뷰는 마우스 환경에서만
   - 배경 FX 캔버스와 Three.js 장면은 데스크톱에서만 지연 로드
   ===================================================================== */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const root = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const EASE = "expo.out";

// index.astro 의 head 인라인 스크립트가 붙인 rd-js 가 없으면(모션 축소·로드 지연 폴백) 정적 페이지로 둔다
const motionOn = root.classList.contains("rd-js");
window.__rdReady = true;

if (!motionOn) {
  $("#pre")?.remove();
} else {
  try {
    init();
  } catch (err) {
    // 모션 초기화가 실패해도 콘텐츠는 보여야 한다
    console.error("[rd-home] motion init failed", err);
    root.classList.remove("rd-js", "rd-intro", "rd-3d", "rd-cursor");
    $("#pre")?.remove();
  }
}

function init() {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const desktop = matchMedia("(min-width: 901px)").matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 0. 스무스 스크롤 ---------- */
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  let introDone = false, menuOpen = false;
  addEventListener("rd:menu-open", () => { menuOpen = true; lenis.stop(); });
  addEventListener("rd:menu-close", () => { menuOpen = false; if (introDone) lenis.start(); });

  /* ---------- 유틸: 줄/단어 분리 ---------- */
  function splitLines(el) {
    // <br>로 나뉜 줄을 .ln > .ln-in 으로 감싼다 (inner HTML 유지)
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p) => `<span class="ln"><span class="ln-in">${p.trim()}</span></span>`).join("");
    return $$(".ln-in", el);
  }
  function splitWords(el, cls) {
    // 텍스트 노드만 단어 단위로 감싼다 (자식 span은 보존)
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
            const s = document.createElement("span"); s.className = cls; s.textContent = tok; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.classList.contains("rot")) { n.classList.add(cls); } // 로테이션 단어는 통째로 한 단어
        else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    return $$("." + cls, el);
  }

  /* ---------- 1. 커스텀 커서 (마우스 환경) ---------- */
  let ring = null;
  if (finePointer) {
    const dot = document.createElement("div"); dot.className = "cur-dot";
    ring = document.createElement("div"); ring.className = "cur-ring";
    document.body.append(dot, ring);
    root.classList.add("rd-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });
    const dotTo = { x: gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" }), y: gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" }) };
    const ringTo = { x: gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" }), y: gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" }) };
    addEventListener("mousemove", (e) => { dotTo.x(e.clientX); dotTo.y(e.clientY); ringTo.x(e.clientX); ringTo.y(e.clientY); });
    const hoverSel = "a,button,.btn,.rd-pill,.svc-index .item,.faq-item,.rd-footer li,.hero-side,.proc,.stat,.go";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(".work")) { ring.classList.add("is-view"); ring.classList.remove("is-hover"); }
      else if (e.target.closest(hoverSel)) { ring.classList.add("is-hover"); ring.classList.remove("is-view"); }
      else ring.classList.remove("is-hover", "is-view");
    });

    /* ---------- 2. 마그네틱 버튼 ---------- */
    $$(".btn,.rd-pill,.go").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- 3. 페이지 안 앵커 → 스무스 스크롤 ---------- */
  const flashRow = (row) => gsap.fromTo(row, { backgroundColor: "rgba(0,217,184,.18)" }, { backgroundColor: "rgba(0,217,184,0)", duration: 1.6, delay: 1.2, clearProps: "backgroundColor" });
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = a.getAttribute("href").length > 1 && $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const isRow = target.classList.contains("svc-row");
    lenis.scrollTo(target, { offset: isRow ? -160 : -80, duration: 1.4 });
    if (isRow) flashRow(target); // 서비스 인덱스 클릭 → 해당 행 1회 하이라이트
  });

  /* ---------- 4. 히어로 준비 ---------- */
  const heroLines = splitLines($(".hero-title"));
  const heroDot = $(".hero-title .dot");
  const obj = $(".obj");

  /* ---------- 5. 프리로더 → 히어로 인트로 ---------- */
  const pre = $("#pre"), cnt = $("#preCnt");
  const intro = gsap.timeline({ defaults: { ease: EASE } });
  const counter = { v: 0 };
  intro
    .to(counter, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: () => { cnt.textContent = Math.round(counter.v); } })
    .to(pre, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "+=0.1")
    .add(() => { pre.remove(); introDone = true; if (!menuOpen) lenis.start(); }, "-=0.3")
    // 헤더
    .to(".rd-nav .rd-logo", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
    .to(".rd-menu > li", { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, "<0.05")
    .to(".rd-nav-right > *", { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, "<0.1")
    // 헤드라인 마스크 리빌
    .to(".hero-copy .eyebrow", { opacity: 1, duration: 0.6 }, "-=0.9")
    .to(heroLines, { y: 0, duration: 1.1, stagger: 0.12 }, "<")
    .fromTo(heroDot, { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, "-=0.55")
    .to(".hero-sub", { opacity: 1, duration: 0.8 }, "-=0.7")
    .to(".hero-actions", { opacity: 1, duration: 0.8 }, "<0.1")
    .to(".hero-meta", { opacity: 1, duration: 0.8 }, "<0.1")
    // 3D 오브젝트
    .fromTo(obj, { scale: 0.7, opacity: 0, rotate: -20 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.6 }, "-=1.6")
    .fromTo(".hero-side", { x: 60 }, { x: 0, duration: 1, clearProps: "transform" }, "-=1.2")
    .to(".svc-index .item", { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, "-=1")
    .add(() => root.classList.remove("rd-intro"));

  // 오브젝트 부유(CSS 폴백 큐브용) + 마우스 패럴랙스
  gsap.to(".obj .cube", { y: -14, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(".obj .rim", { y: 10, rotate: -10, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  if (finePointer) {
    const objX = gsap.quickTo(obj, "x", { duration: 1.2, ease: "power3" });
    const objY = gsap.quickTo(obj, "y", { duration: 1.2, ease: "power3" });
    const objR = gsap.quickTo(obj, "rotate", { duration: 1.2, ease: "power3" });
    addEventListener("mousemove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      objX(nx * 36); objY(ny * 36); objR(nx * 6);
    });
  }
  // 스크롤 패럴랙스 (헤드라인 빠르게, 오브젝트 느리게)
  const heroScrub = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero-copy", { yPercent: -35, opacity: 0.2, ease: "none", scrollTrigger: heroScrub });
  gsap.to(".obj", { yPercent: 25, ease: "none", scrollTrigger: heroScrub });
  gsap.to(".hero-glow", { yPercent: 30, ease: "none", scrollTrigger: heroScrub });

  /* ---------- 6. 정적 글리치 스트릭 깜빡임 (캔버스 FX가 없는 모바일에서 보임) ---------- */
  $$(".streak").forEach((s) => {
    const flick = () => {
      gsap.timeline({ onComplete: flick, delay: gsap.utils.random(1.5, 6) })
        .set(s, { opacity: 1, scaleX: gsap.utils.random(0.4, 1.2), x: gsap.utils.random(-80, 80) })
        .to(s, { opacity: 0, duration: gsap.utils.random(0.1, 0.3), ease: "power1.in" });
    };
    gsap.set(s, { opacity: 0 });
    flick();
  });

  /* ---------- 7. 공용 리빌: 섹션 헤드라인 단어 / data-reveal ---------- */
  $$(".h-section").forEach((h) => {
    const words = splitWords(h, "w");
    gsap.to(words, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.05, scrollTrigger: { trigger: h, start: "top 85%" } });
  });
  const revealSel = [".section .eyebrow", ".section .lead", ".chip-row", ".kw-list", ".works .head .btn", ".stat", ".proc", ".cmp", ".faq-list", ".cta p", ".cta .actions", ".work", ".svc-list", ".partner", ".partners .note"];
  $$(revealSel.join(",")).forEach((el) => el.setAttribute("data-reveal", ""));
  // 그리드류는 부모 기준 스태거
  const groups = [[".stat-grid", ".stat", 0.1], [".proc-grid", ".proc", 0.12], [".cmp-grid", ".cmp", 0.15], [".works-grid", ".work", 0.06], [".partner-grid", ".partner", 0.025]];
  groups.forEach(([parentSel, childSel, stagger]) => {
    $$(parentSel).forEach((p) => {
      gsap.to($$(childSel, p), { opacity: 1, y: 0, duration: 1, ease: EASE, stagger, scrollTrigger: { trigger: p, start: "top 80%" } });
    });
  });
  const groupSel = groups.map((g) => g[0]).join(",");
  $$("[data-reveal]").filter((el) => !el.closest(groupSel)).forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  /* ---------- 8a. 소개: 헤드라인 단어 로테이션 ("당신의 [프로젝트] 모양이 됩니다") ---------- */
  $$(".rot").forEach((rot) => {
    const words = (rot.dataset.words || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (words.length < 2) return;
    rot.innerHTML = `<span class="rot-in">${rot.textContent}</span>`;
    const inner = rot.querySelector(".rot-in");
    let i = 0, active = false;
    ScrollTrigger.create({ trigger: rot, start: "top 95%", end: "bottom 5%", onToggle: (s) => (active = s.isActive) });
    setInterval(() => {
      if (!active || document.hidden) return;
      i = (i + 1) % words.length;
      gsap.timeline()
        .to(inner, { yPercent: -110, opacity: 0, duration: 0.45, ease: "power3.in" })
        .add(() => { inner.textContent = words[i]; })
        .fromTo(inner, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
    }, 2600);
  });

  /* ---------- 8. 소개: 본문 스크럽 하이라이트 + 키워드 순환 ---------- */
  const introLead = $(".intro-right .lead");
  introLead.classList.add("scrub-words");
  const sw = splitWords(introLead, "sw");
  gsap.to(sw, { color: "#f4f3ef", stagger: 0.1, ease: "none", scrollTrigger: { trigger: introLead, start: "top 80%", end: "bottom 45%", scrub: 0.5 } });
  const kws = $$(".kw-list span");
  let kwIdx = 0;
  setInterval(() => {
    if (document.hidden) return;
    kws.forEach((k) => k.classList.remove("on"));
    for (let i = 0; i < 4; i++) kws[(kwIdx + i * 3) % kws.length].classList.add("on");
    kwIdx++;
  }, 1500);

  /* ---------- 9. 피처 비주얼 ---------- */
  const frame = $(".feature .frame");
  gsap.fromTo(frame, { scale: 0.92, borderRadius: 24 }, { scale: 1, borderRadius: 4, ease: "none", scrollTrigger: { trigger: frame, start: "top 90%", end: "top 30%", scrub: true } });
  gsap.to(".feature .frame .band", { yPercent: -40, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".feature .title", { y: 80 }, { y: -80, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  // 캡션 타이프라이터 + 타임코드
  const cap = $(".feature .cap .mono"), capText = cap.textContent; cap.textContent = "";
  const tc = $(".feature .cap2 .mono"); let frames = 0, tcOn = false;
  ScrollTrigger.create({ trigger: frame, start: "top 75%", once: true, onEnter: () => { let i = 0; const iv = setInterval(() => { cap.textContent = capText.slice(0, ++i); if (i >= capText.length) clearInterval(iv); }, 28); } });
  ScrollTrigger.create({ trigger: frame, start: "top bottom", end: "bottom top", onToggle: (s) => (tcOn = s.isActive) });
  setInterval(() => {
    if (!tcOn) return;
    frames++;
    const s = Math.floor(frames / 24), f = frames % 24;
    tc.textContent = `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.${String(f).padStart(2, "0")}`;
  }, 1000 / 24);

  /* ---------- 10. 서비스 리스트 ---------- */
  const list = $(".svc-list");
  const rows = $$(".svc-row");
  rows.forEach((row) => {
    gsap.to(row.querySelectorAll(".num,.ttl,.desc,.go"), { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.06, scrollTrigger: { trigger: row, start: "top 88%" } });
    // 구분선 그리기
    const ln = document.createElement("i"); ln.className = "ln-draw"; row.appendChild(ln);
    gsap.to(ln, { scaleX: 1, duration: 1.2, ease: EASE, scrollTrigger: { trigger: row, start: "top 90%" } });
  });
  // 호버: 형제 감쇠 + 커서를 따라다니는 플로팅 프리뷰
  if (finePointer) {
    const fp = document.createElement("div"); fp.className = "float-prev"; fp.innerHTML = "<i></i>"; document.body.appendChild(fp);
    gsap.set(fp, { xPercent: -50, yPercent: -50, scale: 0.9, rotate: -4 });
    const fpX = gsap.quickTo(fp, "x", { duration: 0.5, ease: "power3" }), fpY = gsap.quickTo(fp, "y", { duration: 0.5, ease: "power3" });
    rows.forEach((row, i) => {
      row.addEventListener("mouseenter", () => {
        list.classList.add("is-hover");
        fp.className = "float-prev p" + (i + 1); fp.dataset.label = row.dataset.label || "";
        gsap.to(fp, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: 0.5, ease: EASE });
      });
      row.addEventListener("mouseleave", () => { list.classList.remove("is-hover"); gsap.to(fp, { opacity: 0, scale: 0.9, duration: 0.35 }); });
    });
    list.addEventListener("mousemove", (e) => { fpX(e.clientX + 180); fpY(e.clientY); });
  }

  /* ---------- 11. 마키 (스크롤 속도 연동) ---------- */
  const wrapper = $(".mq-wrap"), track = $(".mq-track");
  wrapper.appendChild(track.cloneNode(true));
  let mqX = 0, mqDir = -1, mqBoost = 0;
  lenis.on("scroll", ({ velocity, direction }) => { if (direction) mqDir = direction === 1 ? -1 : 1; mqBoost = Math.min(Math.abs(velocity) * 0.6, 40); });
  gsap.ticker.add(() => {
    const gap = parseFloat(getComputedStyle(wrapper).columnGap) || 56;
    const w = track.offsetWidth + gap;
    mqX += mqDir * (1.2 + mqBoost);
    mqBoost *= 0.92;
    if (mqX <= -w) mqX += w;
    if (mqX > 0) mqX -= w;
    gsap.set(wrapper, { x: mqX });
  });

  /* ---------- 12. 작업 그리드 미세 패럴랙스 ---------- */
  $$(".work").forEach((w) => {
    const amt = desktop ? (w.classList.contains("tall") ? -40 : 30) : (w.classList.contains("tall") ? -12 : 10);
    gsap.to(w, { y: amt, ease: "none", scrollTrigger: { trigger: ".works-grid", start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---------- 13. 수치 카운트업 ---------- */
  $$(".stat .v[data-count]").forEach((v) => {
    const tn = Array.from(v.childNodes).find((n) => n.nodeType === 3);
    const target = parseInt(v.dataset.count, 10); const o = { n: 0 };
    if (!tn || !target) return;
    const sup = v.querySelector("sup"); if (sup) gsap.set(sup, { scale: 0 });
    tn.textContent = "0";
    ScrollTrigger.create({ trigger: v, start: "top 85%", once: true, onEnter: () => {
      gsap.to(o, { n: target, duration: 1.4, ease: EASE, onUpdate: () => (tn.textContent = Math.round(o.n)), onComplete: () => sup && gsap.to(sup, { scale: 1, duration: 0.5, ease: "back.out(3)" }) });
    } });
  });

  /* ---------- 14. 프로세스: 번호 점등 + 연결선 ---------- */
  const pg = $(".proc-grid");
  const pl = document.createElement("div"); pl.className = "proc-line"; pg.appendChild(pl);
  gsap.timeline({ scrollTrigger: { trigger: pg, start: "top 75%" } })
    .to(pl, { scaleX: 1, duration: 1.4, ease: EASE })
    .to(".proc .n", { color: "#00d9b8", duration: 0.3, stagger: 0.3 }, 0.2);

  /* ---------- 15. 비교 다이어그램 ---------- */
  const cmps = $$(".cmp");
  gsap.timeline({ scrollTrigger: { trigger: ".cmp-grid", start: "top 70%" } })
    .to($$(".node", cmps[0]), { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: EASE, stagger: { each: 0.08, from: "random" } })
    .to($$(".node", cmps[1]), { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: EASE, stagger: 0.08 }, "-=0.3");

  /* ---------- 16. FAQ 아코디언 ---------- */
  const faqItems = $$(".faq-item");
  const setFaq = (item, on) => {
    item.classList.toggle("is-open", on);
    item.querySelector(".q").setAttribute("aria-expanded", on ? "true" : "false");
    gsap.to(item.querySelector(".a"), { height: on ? "auto" : 0, opacity: on ? 1 : 0, marginTop: on ? 18 : 0, duration: on ? 0.45 : 0.4, ease: "power2.inOut", onComplete: () => ScrollTrigger.refresh() });
  };
  faqItems.forEach((item, i) => {
    item.querySelector(".q").addEventListener("click", () => {
      const on = !item.classList.contains("is-open");
      faqItems.forEach((o) => { if (o !== item && o.classList.contains("is-open")) setFaq(o, false); });
      setFaq(item, on);
    });
    if (i === 0) ScrollTrigger.create({ trigger: item, start: "top 80%", once: true, onEnter: () => setFaq(item, true) });
  });

  /* ---------- 17. CTA ---------- */
  const ctaLines = splitLines($(".cta h2"));
  gsap.to(ctaLines, { y: 0, duration: 1.1, ease: EASE, stagger: 0.12, scrollTrigger: { trigger: ".cta", start: "top 70%" } });
  if (finePointer) {
    const glow = $(".cta .glow");
    const gX = gsap.quickTo(glow, "x", { duration: 1, ease: "power3" }), gY = gsap.quickTo(glow, "y", { duration: 1, ease: "power3" });
    $(".cta").addEventListener("mousemove", (e) => { const r = e.currentTarget.getBoundingClientRect(); gX((e.clientX - r.left - r.width / 2) * 0.4); gY((e.clientY - r.top - r.height / 2) * 0.4); });
  }

  /* ---------- 18. 레이아웃 변동 시 트리거 재계산 ---------- */
  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  /* ---------- 19. 데스크톱 전용: 배경 FX 캔버스 + Three.js 장면 (지연 로드) ---------- */
  if (desktop && finePointer) {
    import("./fx.js").then((m) => m.initFx()).catch((err) => console.warn("[rd-home] fx skipped", err));
    import("./scene3d.js")
      .then((m) => m.initScenes({ gsap, ScrollTrigger, lenis, ring }))
      .then((ok) => { if (!ok) root.classList.remove("rd-3d"); })
      .catch((err) => { console.warn("[rd-home] 3d skipped", err); root.classList.remove("rd-3d"); });
  }
}
