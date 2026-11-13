/* =====================================================================
   Three.js 장면 (데스크톱 전용, home.js 가 지연 로드)
   1) 히어로 3D 오브젝트 — 확정 콘셉트 "7-서비스 생태계"
      코어를 도는 위성 7개(6번 AI Solution만 민트) ↔ 원자 모양 변주.
      위성 호버 → 서비스명 라벨, 클릭 → 해당 서비스 행으로 이동, 빈 곳 클릭 → 변주 전환.
   2) 소개 섹션 부유 크롬 소품 5개 + 번호 라벨
   시안 design/hero3d.js · props3d.js 이식. 비교용 콘셉트(도형·굿즈·로고·액체)와 키보드 전환은 뺐다.
   WebGL 을 못 쓰면 false 를 반환하고, 호출부가 CSS 큐브 폴백을 되살린다.
   ===================================================================== */
import * as THREE from "three";

const SERVICES = ["IP License & Collabo", "Merchandising", "Distribution", "Pop-up Operation", "Visual Studio", "AI Solution", "Investment & Biz Dev"];

export function initScenes(ctx) {
  const shared = initHero(ctx);
  if (!shared) return false;
  try { initProps(ctx, shared); } catch (err) { console.warn("[rd-home] intro props skipped", err); }
  return true;
}

/* ---------------------------------------------------------------------
   1) 히어로
   --------------------------------------------------------------------- */
function initHero({ gsap, ScrollTrigger, lenis, ring }) {
  const host = document.querySelector(".obj");
  if (!host) return null;

  /* ---------- 렌더러 ---------- */
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); } catch { return null; }
  const SIZE = 560;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(SIZE, SIZE, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.classList.add("has-3d");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  /* ---------- 스튜디오 환경맵 (캔버스 생성) ---------- */
  function envFace(kind) {
    const c = document.createElement("canvas"); c.width = c.height = 512;
    const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#2a2a2e"); g.addColorStop(0.5, "#0b0b0d"); g.addColorStop(1, "#050506");
    x.fillStyle = g; x.fillRect(0, 0, 512, 512);
    const box = (bx, by, bw, bh, col, blur) => { x.save(); x.shadowColor = col; x.shadowBlur = blur; x.fillStyle = col; x.fillRect(bx, by, bw, bh); x.restore(); };
    if (kind === "top") { box(96, 120, 320, 90, "rgba(255,255,255,.95)", 60); box(150, 330, 212, 24, "rgba(255,255,255,.5)", 30); }
    if (kind === "px") { box(60, 40, 40, 440, "rgba(255,255,255,.85)", 40); box(380, 300, 90, 160, "rgba(0,200,170,.6)", 60); }
    if (kind === "nx") { box(410, 40, 40, 440, "rgba(255,255,255,.7)", 40); box(40, 330, 120, 120, "rgba(0,180,152,.5)", 60); }
    if (kind === "pz") { box(120, 60, 272, 36, "rgba(255,255,255,.9)", 36); box(0, 380, 512, 132, "rgba(0,169,143,.45)", 80); }
    if (kind === "nz") { box(200, 90, 112, 300, "rgba(255,255,255,.35)", 50); box(0, 400, 512, 112, "rgba(0,180,152,.35)", 80); }
    if (kind === "bottom") { const r = x.createRadialGradient(256, 256, 20, 256, 256, 300); r.addColorStop(0, "rgba(0,190,160,.9)"); r.addColorStop(1, "rgba(0,190,160,0)"); x.fillStyle = r; x.fillRect(0, 0, 512, 512); }
    return c;
  }
  const cube = new THREE.CubeTexture([envFace("px"), envFace("nx"), envFace("top"), envFace("bottom"), envFace("pz"), envFace("nz")]);
  cube.colorSpace = THREE.SRGBColorSpace; cube.needsUpdate = true;
  scene.environment = cube;

  /* ---------- 라이트 ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x00c2a4, 2.2); rim.position.set(-4, -3, 2); scene.add(rim);
  const fill = new THREE.PointLight(0x00d9b8, 6, 12); fill.position.set(2, -3, 3); scene.add(fill);

  /* ---------- 재질 ---------- */
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe8e8ea, metalness: 1, roughness: 0.14, envMap: cube, envMapIntensity: 1.6, clearcoat: 0.6, clearcoatRoughness: 0.1 });
  const accent = new THREE.MeshPhysicalMaterial({ color: 0x00d9b8, metalness: 0.85, roughness: 0.22, envMap: cube, envMapIntensity: 1.2, clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const darkChrome = new THREE.MeshPhysicalMaterial({ color: 0x55555a, metalness: 1, roughness: 0.2, envMap: cube, envMapIntensity: 1.4 });
  // 평면이 많은 형태(박스)는 거울 크롬이면 어둡게 보여서 브러시드 메탈로
  const brushed = new THREE.MeshPhysicalMaterial({ color: 0xdadadf, metalness: 1, roughness: 0.34, envMap: cube, envMapIntensity: 2.2, clearcoat: 0.3, clearcoatRoughness: 0.4 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0xbbbbbb, transparent: true, opacity: 0.45 });

  const M = (geo, mat) => new THREE.Mesh(geo, mat || chrome);
  const at = (o, x, y, z, rx, ry, rz) => { o.position.set(x || 0, y || 0, z || 0); o.rotation.set(rx || 0, ry || 0, rz || 0); return o; };

  /* ---------- 위성 호버 상태 ---------- */
  let hovered = null;
  const scaleTo = new THREE.Vector3();

  /* ---------- 형태 빌더 (각각 {obj, sats?, update?} 반환) ---------- */
  const builders = [
    () => {
      // 7-서비스 생태계: 코어 + 위성 7개
      const g = new THREE.Group();
      g.add(M(new THREE.SphereGeometry(0.78, 96, 96)));
      const sats = [], lines = [];
      for (let i = 0; i < 7; i++) {
        const isAI = i === 5;
        const s = M(new THREE.SphereGeometry(isAI ? 0.3 : 0.22, 48, 48), isAI ? accent : chrome);
        s.userData.svc = i;
        g.add(s); sats.push({ m: s, r: 1.55 + (i % 3) * 0.28, inc: (i / 7) * Math.PI, ang: i * 1.1, sp: 0.35 + (i % 4) * 0.12 });
        const lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        const l = new THREE.Line(lg, lineMat); g.add(l); lines.push(l);
      }
      const orbit = at(M(new THREE.TorusGeometry(1.95, 0.02, 12, 200), darkChrome), 0, 0, 0, Math.PI / 2.3, 0.3); g.add(orbit);
      let lastT = null;
      return { obj: g, sats: sats.map((s) => s.m), update: (t) => {
        const dt = lastT === null ? 0 : Math.min(t - lastT, 0.05); lastT = t;
        sats.forEach((s, i) => {
          s.ang += dt * s.sp * (hovered === s.m ? 0.12 : 1); // 호버 중인 위성은 거의 멈춤
          const x = Math.cos(s.ang) * s.r, z = Math.sin(s.ang) * s.r;
          s.m.position.set(x * Math.cos(s.inc), z * Math.sin(s.inc) * 0.9, z * Math.cos(s.inc) + x * Math.sin(s.inc) * 0.4);
          const k = hovered === s.m ? 1.5 : 1; s.m.scale.lerp(scaleTo.set(k, k, k), 0.15);
          const p = lines[i].geometry.attributes.position; p.setXYZ(1, s.m.position.x, s.m.position.y, s.m.position.z); p.needsUpdate = true;
        });
        orbit.rotation.z += 0.002;
      } };
    },
    () => {
      // 원자 모양: 민트 코어 + 3개 궤도 링
      const g = new THREE.Group();
      g.add(M(new THREE.SphereGeometry(0.6, 96, 96), accent));
      const rings = [0, 1, 2].map((i) => { const r = at(M(new THREE.TorusGeometry(1.6, 0.06, 24, 200)), 0, 0, 0, (Math.PI / 3) * i, (Math.PI / 4) * i); g.add(r); return r; });
      const dots = rings.map(() => { const d = M(new THREE.SphereGeometry(0.16, 32, 32)); g.add(d); return d; });
      const v = new THREE.Vector3();
      return { obj: g, update: (t) => { rings.forEach((r, i) => { r.rotation.z += 0.004 * (i + 1); const a = t * (0.8 + i * 0.3); dots[i].position.copy(v.set(Math.cos(a) * 1.6, Math.sin(a) * 1.6, 0).applyEuler(r.rotation)); }); } };
    },
  ];

  /* ---------- 현재 형태 ---------- */
  const group = new THREE.Group(); scene.add(group);
  let current = null, shapeIdx = 0;
  function setShape(i) {
    if (current) { group.remove(current.obj); current.obj.traverse((n) => { if (n.geometry) n.geometry.dispose(); }); }
    shapeIdx = i;
    current = builders[i]();
    group.add(current.obj);
  }
  setShape(0);

  /* ---------- 전환: 찌그러졌다 펴지는 '액체' 느낌 ---------- */
  const tw = { s: 1, sq: 0 };
  let switching = false, pending = null;
  function morphTo(next) {
    if (switching) { pending = next; return; } // 전환 중 요청은 끝난 뒤 실행
    if (next === shapeIdx) return;
    switching = true;
    gsap.timeline({ onComplete: () => { switching = false; if (pending !== null) { const p = pending; pending = null; morphTo(p); } } })
      .to(tw, { sq: 0.55, duration: 0.28, ease: "power3.in" })
      .to(tw, { s: 0.0, duration: 0.22, ease: "power3.in" }, "-=0.1")
      .add(() => { hovered = null; setShape(next); group.rotation.set(Math.random() * 6, Math.random() * 6, 0); })
      .to(tw, { s: 1.12, sq: -0.25, duration: 0.55, ease: "expo.out" })
      .to(tw, { s: 1, sq: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" }, "-=0.1");
  }
  const nextIdx = () => (shapeIdx + 1) % builders.length;
  setInterval(() => { if (!document.hidden && scrollY < innerHeight && !hovered) morphTo(nextIdx()); }, 6000);
  let scrollProg = 0, lastBand = 0;
  ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top", onUpdate: (s) => {
    scrollProg = s.progress;
    const band = Math.floor(s.progress * 3);
    if (band !== lastBand) { lastBand = band; morphTo(nextIdx()); }
  } });

  /* ---------- 마우스 ---------- */
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  addEventListener("mousemove", (e) => { target.x = (e.clientX / innerWidth - 0.5) * 2; target.y = (e.clientY / innerHeight - 0.5) * 2; });

  /* ---------- 위성 호버: 서비스 이름 라벨 + 클릭 시 해당 서비스로 이동 ---------- */
  const label = document.createElement("div"); label.className = "sat-label"; document.body.appendChild(label);
  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2(); let mx = 0, my = 0, overCanvas = false;
  const canvas = renderer.domElement;
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1; ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    mx = e.clientX; my = e.clientY; overCanvas = true;
  });
  canvas.addEventListener("mouseleave", () => { overCanvas = false; });
  function pick() {
    let hit = null;
    if (overCanvas && current && current.sats) {
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(current.sats, false);
      hit = hits.length ? hits[0].object : null;
    }
    if (hit !== hovered) {
      hovered = hit;
      if (hit) { const i = hit.userData.svc; label.innerHTML = `<b>0${i + 1}</b>${SERVICES[i]}`; label.classList.add("on"); ring?.classList.add("is-hover"); }
      else { label.classList.remove("on"); ring?.classList.remove("is-hover"); }
    }
    if (hovered) label.style.transform = `translate(${mx + 18}px, ${my - 14}px)`;
  }
  canvas.addEventListener("click", () => {
    if (hovered) {
      const row = document.querySelectorAll(".svc-row")[hovered.userData.svc];
      if (row) lenis.scrollTo(row, { offset: -160, duration: 1.4 });
      return;
    }
    morphTo(nextIdx());
  });

  /* ---------- 루프 ---------- */
  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 }).observe(host);
  function loop() {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) { if (hovered) { hovered = null; label.classList.remove("on"); } return; }
    const t = clock.getElapsedTime();
    cur.x += (target.x - cur.x) * 0.06; cur.y += (target.y - cur.y) * 0.06;
    group.rotation.y += 0.0035 + scrollProg * 0.02;
    group.rotation.x = Math.sin(t * 0.35) * 0.35 + cur.y * 0.45 + scrollProg * 2.2;
    group.rotation.z = Math.cos(t * 0.27) * 0.2 + cur.x * 0.35;
    const breathe = 1 + Math.sin(t * 1.3) * 0.015;
    group.scale.set(tw.s * breathe * (1 + tw.sq * 0.6), tw.s * breathe * (1 - tw.sq), tw.s * breathe * (1 + tw.sq * 0.6));
    fill.position.x = Math.sin(t * 0.8) * 3; fill.position.y = Math.cos(t * 0.6) * 2 - 1;
    if (current && current.update) current.update(t);
    pick();
    renderer.render(scene, camera);
  }
  loop();

  // 소개 섹션 소품이 같은 환경맵·재질을 재사용
  return { cube, chrome, accent, darkChrome, brushed };
}

/* ---------------------------------------------------------------------
   2) 소개 섹션 부유 소품
   --------------------------------------------------------------------- */
function initProps({ ScrollTrigger }, { cube, chrome, accent, brushed }) {
  const section = document.querySelector(".intro-sec");
  if (!section) return;

  const layer = document.createElement("div"); layer.className = "props-layer"; layer.setAttribute("aria-hidden", "true"); section.appendChild(layer);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { layer.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  layer.appendChild(renderer.domElement);

  const scene = new THREE.Scene(); scene.environment = cube;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100); camera.position.set(0, 0, 10);
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x00c2a4, 1.6); rim.position.set(-4, -3, 2); scene.add(rim);

  /* ---------- 소품 정의: 형태, 위치(x,y,z), 라벨 ---------- */
  const DEFS = [
    { geo: () => new THREE.BoxGeometry(0.62, 0.62, 0.62), mat: brushed, pos: [-5.6, 2.3, -2.5], label: "01 · IP LICENSE", spin: [0.004, 0.006] },
    { geo: () => new THREE.CylinderGeometry(0.55, 0.55, 0.12, 96), mat: chrome, pos: [5.4, 2.8, -4], label: "02 · MERCHANDISING", spin: [0.003, 0.002] },
    { geo: () => new THREE.ConeGeometry(0.42, 0.85, 96), mat: chrome, pos: [-4.8, -2.6, -1.5], label: "03 · DISTRIBUTION", spin: [0.002, 0.005] },
    { geo: () => new THREE.TorusKnotGeometry(0.34, 0.12, 160, 32, 2, 3), mat: chrome, pos: [4.2, -2.9, -3], label: "04 · POP-UP", spin: [0.005, 0.004] },
    { geo: () => new THREE.TorusGeometry(0.42, 0.14, 48, 128), mat: accent, pos: [6.6, -0.3, -7], label: "06 · AI SOLUTION", spin: [0.003, 0.006] },
  ];
  const props = DEFS.map((d) => {
    const m = new THREE.Mesh(d.geo(), d.mat); m.position.set(...d.pos); m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    scene.add(m);
    const el = document.createElement("div"); el.className = "prop-label"; el.textContent = d.label; layer.appendChild(el);
    return { m, el, base: new THREE.Vector3(...d.pos), spin: d.spin, ph: Math.random() * 6 };
  });

  /* ---------- 크기 ---------- */
  let W = 0, H = 0;
  function resize() {
    W = section.clientWidth; H = section.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false); renderer.domElement.style.width = W + "px"; renderer.domElement.style.height = H + "px";
    camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(section); else addEventListener("resize", resize);

  /* ---------- 스크롤 진행률 (-1 → 1) / 마우스 ---------- */
  let prog = 0;
  ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", scrub: true, onUpdate: (s) => { prog = s.progress * 2 - 1; } });
  const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  addEventListener("mousemove", (e) => { mouse.x = (e.clientX / innerWidth - 0.5) * 2; mouse.y = (e.clientY / innerHeight - 0.5) * 2; });

  /* ---------- 루프 ---------- */
  let visible = false;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: "200px" }).observe(section);
  const v = new THREE.Vector3();
  function loop(now) {
    requestAnimationFrame(loop);
    if (!visible || document.hidden || !W) return;
    const t = now / 1000;
    cur.x += (mouse.x - cur.x) * 0.05; cur.y += (mouse.y - cur.y) * 0.05;
    props.forEach((p) => {
      const depth = (10 - p.m.position.z) / 10; // 멀수록 1.x → 더 크게 움직임(패럴랙스)
      p.m.rotation.x += p.spin[0]; p.m.rotation.y += p.spin[1];
      p.m.position.x = p.base.x + Math.sin(t * 0.5 + p.ph) * 0.18 + cur.x * 0.35 * depth;
      p.m.position.y = p.base.y + Math.cos(t * 0.4 + p.ph) * 0.22 - prog * 1.6 * depth + cur.y * -0.25 * depth;
      // 라벨: 3D 위치를 화면 좌표로 투영
      v.copy(p.m.position).project(camera);
      const sx = (v.x * 0.5 + 0.5) * W, sy = (-v.y * 0.5 + 0.5) * H;
      p.el.style.transform = `translate(${Math.round(sx + 34)}px, ${Math.round(sy - 8)}px)`;
    });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
}
