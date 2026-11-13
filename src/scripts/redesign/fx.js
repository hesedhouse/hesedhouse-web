/* =====================================================================
   배경 앰비언트 FX — 글리치 스트릭(가로로 흐르는 선) + 필름 그레인
   시안 design/fx.js 이식. 강도: strong / soft / off (우하단 토글, localStorage 저장)
   데스크톱에서만 home.js 가 지연 로드한다.
   ===================================================================== */
const PRESETS = {
  strong: { count: 52, alpha: 0.9, grain: 0.07, burstEvery: [0.6, 2.2] },
  soft: { count: 22, alpha: 0.55, grain: 0.04, burstEvery: [2.5, 6] },
  off: { count: 0, alpha: 0, grain: 0, burstEvery: [99, 99] },
};
const ACCENT = [0, 217, 184], WHITE = [255, 255, 255];
const rnd = (a, b) => a + Math.random() * (b - a);

function readMode() {
  try { const m = localStorage.getItem("hesed-fx"); return PRESETS[m] ? m : "strong"; } catch { return "strong"; }
}

export function initFx() {
  let mode = readMode();
  let P = PRESETS[mode];

  /* ---------- 캔버스 2장 ---------- */
  const mk = (id, z, blend) => {
    const c = document.createElement("canvas"); c.id = id;
    c.style.cssText = `position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:${z};mix-blend-mode:${blend}`;
    document.body.appendChild(c); return c;
  };
  const sc = mk("fxStreaks", 60, "screen"); // 선
  const gc = mk("fxGrain", 61, "overlay"); // 그레인
  const sx = sc.getContext("2d"), gx = gc.getContext("2d");
  if (!sx || !gx) { sc.remove(); gc.remove(); return; }
  document.documentElement.classList.add("rd-fx"); // 정적 장식선(.streak) 숨김
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let W = 0, H = 0;
  const resize = () => {
    W = innerWidth; H = innerHeight;
    [sc, gc].forEach((c) => { c.width = W * dpr; c.height = H * dpr; });
    sx.setTransform(dpr, 0, 0, dpr, 0, 0); gx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); addEventListener("resize", resize);

  /* ---------- 스트릭 ---------- */
  const streaks = [];
  function spawn(s, fresh) {
    s = s || {};
    const accent = Math.random() < 0.18;
    s.y = rnd(0, H);
    s.len = Math.random() < 0.15 ? rnd(300, 900) : rnd(40, 260);
    s.speed = rnd(2, 14) * (Math.random() < 0.5 ? 1 : -1);
    s.x = fresh ? rnd(-s.len, W) : (s.speed > 0 ? -s.len : W);
    s.th = Math.random() < 0.12 ? 2 : 1;
    s.col = accent ? ACCENT : WHITE;
    s.a = rnd(0.15, 1) * (accent ? 1 : 0.8);
    s.life = rnd(0.4, 3); // 초. 끝나면 사라졌다가 재생성
    s.t = 0;
    s.flick = Math.random() < 0.3;
    return s;
  }
  function rebuild() { streaks.length = 0; for (let i = 0; i < P.count; i++) streaks.push(spawn(null, true)); }
  rebuild();

  // 글리치 버스트: 한 y대역에 짧은 선 여러 개가 순간 등장
  const bursts = [];
  let nextBurst = rnd(...P.burstEvery);
  function burst() {
    const y = rnd(0, H), n = Math.round(rnd(5, 12)), accent = Math.random() < 0.35;
    const b = { t: 0, life: rnd(0.08, 0.22), lines: [] };
    for (let i = 0; i < n; i++) b.lines.push({ x: rnd(0, W), y: y + rnd(-18, 18), len: rnd(20, 180), th: Math.random() < 0.3 ? 2 : 1, col: accent ? ACCENT : WHITE, a: rnd(0.4, 1) });
    bursts.push(b);
  }

  // 섹션별 밀도: 히어로·CTA 위에서는 진하게, 본문에서는 옅게
  let hotRects = [];
  function updateHot() {
    hotRects = [".hero", ".cta", ".feature .frame"].map((sel) => document.querySelector(sel)).filter(Boolean).map((el) => el.getBoundingClientRect());
  }
  const hotMul = (y) => (hotRects.some((r) => y >= r.top && y <= r.bottom) ? 1.6 : 0.55);

  /* ---------- 그레인 ---------- */
  const noiseFrames = [];
  for (let f = 0; f < 6; f++) {
    const c = document.createElement("canvas"); c.width = 192; c.height = 192;
    const nx = c.getContext("2d");
    const img = nx.createImageData(192, 192);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    nx.putImageData(img, 0, 0);
    noiseFrames.push(c);
  }
  let grainTick = 0;

  /* ---------- 루프 ---------- */
  let last = performance.now(), hotTick = 0, cleared = false;
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    requestAnimationFrame(frame);
    if (mode === "off" || document.hidden) {
      if (!cleared) { sx.clearRect(0, 0, W, H); gx.clearRect(0, 0, W, H); cleared = true; }
      return;
    }
    cleared = false;

    if ((hotTick += dt) > 0.25) { updateHot(); hotTick = 0; }

    // 선
    sx.clearRect(0, 0, W, H);
    for (const s of streaks) {
      s.t += dt; s.x += s.speed * (dt * 60);
      if (s.t > s.life || s.x > W + s.len || s.x < -s.len) { spawn(s, false); continue; }
      const fade = Math.min(1, s.t / 0.12) * Math.min(1, (s.life - s.t) / 0.25);
      const fl = s.flick ? (Math.random() < 0.5 ? 0.3 : 1) : 1;
      const a = s.a * fade * fl * P.alpha * hotMul(s.y);
      if (a <= 0.01) continue;
      const g = sx.createLinearGradient(s.x, 0, s.x + s.len, 0);
      const c = `${s.col[0]},${s.col[1]},${s.col[2]}`;
      g.addColorStop(0, `rgba(${c},0)`); g.addColorStop(0.5, `rgba(${c},${Math.min(a, 1)})`); g.addColorStop(1, `rgba(${c},0)`);
      sx.fillStyle = g; sx.fillRect(s.x, s.y, s.len, s.th);
    }
    // 버스트
    nextBurst -= dt; if (nextBurst <= 0) { burst(); nextBurst = rnd(...P.burstEvery); }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i]; b.t += dt;
      if (b.t > b.life) { bursts.splice(i, 1); continue; }
      for (const l of b.lines) {
        const c = `${l.col[0]},${l.col[1]},${l.col[2]}`;
        sx.fillStyle = `rgba(${c},${l.a * P.alpha * (Math.random() < 0.7 ? 1 : 0.2)})`;
        sx.fillRect(l.x + (Math.random() - 0.5) * 6, l.y, l.len, l.th);
      }
    }

    // 그레인 (3프레임마다 갱신)
    if (grainTick++ % 3 === 0) {
      gx.clearRect(0, 0, W, H);
      gx.globalAlpha = P.grain;
      const pat = gx.createPattern(noiseFrames[(grainTick / 3) % noiseFrames.length | 0], "repeat");
      gx.save(); gx.translate(rnd(-96, 0), rnd(-96, 0)); gx.fillStyle = pat; gx.fillRect(0, 0, W + 192, H + 192); gx.restore();
      gx.globalAlpha = 1;
    }
  }
  requestAnimationFrame(frame);

  /* ---------- 강도 토글 UI (검토용: 발행 전 기본 강도 확정 후 유지 여부 결정) ---------- */
  const ui = document.createElement("div"); ui.className = "fx-toggle";
  ui.innerHTML = `<span class="fx-lbl">BG FX</span>` +
    [["strong", "진하게"], ["soft", "옅게"], ["off", "끄기"]].map(([k, l]) => `<button type="button" data-fx="${k}">${l}</button>`).join("");
  document.body.appendChild(ui);
  const setMode = (m) => {
    mode = m; P = PRESETS[m];
    try { localStorage.setItem("hesed-fx", m); } catch { /* 저장 불가 환경은 무시 */ }
    rebuild(); nextBurst = rnd(...P.burstEvery);
    ui.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.fx === m));
  };
  ui.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setMode(b.dataset.fx); });
  setMode(mode);
}
