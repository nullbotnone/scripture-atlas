const $ = (selector) => document.querySelector(selector);
const format = (number) => new Intl.NumberFormat("zh-CN").format(number);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

const state = {
  meta: null, verses: null, src: null, dst: null, votes: null, bookOf: null,
  chapterOf: null, numberOf: null, neighbors: null, matrix: null,
  selected: 0, tab: "arcs", sample: [], filteredCount: 0, pairFilter: null,
  matrixMode: "count", hoveredMatrix: null, theme: "dark",
};

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 2800);
}

function refOf(index, short = false) {
  const book = state.meta.books[state.bookOf[index]];
  return `${short ? book.abbr : book.zh} ${state.chapterOf[index]}:${state.numberOf[index]}`;
}

function parseRef(value) {
  const match = value.trim().match(/^(.+?)[\s.]+(\d+)\s*[:：.]\s*(\d+)$/) || value.trim().match(/^(.+?)(\d+)\s*[:：.]\s*(\d+)$/);
  if (!match) return null;
  const name = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const chapter = Number(match[2]);
  const verse = Number(match[3]);
  const book = state.meta.books.find((item) => [item.zh.toLowerCase(), item.en.toLowerCase(), item.abbr.toLowerCase()].includes(name));
  if (!book || chapter < 1 || chapter > book.chapters.length || verse < 1 || verse > book.chapters[chapter - 1]) return null;
  let index = book.start;
  for (let i = 0; i < chapter - 1; i++) index += book.chapters[i];
  return index + verse - 1;
}

function setTab(tab) {
  state.tab = tab;
  for (const button of document.querySelectorAll(".tab")) {
    const active = button.dataset.tab === tab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  }
  $("#arcPanel").hidden = tab !== "arcs";
  $("#matrixPanel").hidden = tab !== "matrix";
  $("#pathPanel").hidden = tab !== "path";
  if (tab === "arcs") requestAnimationFrame(drawArcs);
  if (tab === "matrix") requestAnimationFrame(drawMatrix);
}

function selectVerse(index, options = {}) {
  if (index == null || index < 0 || index >= state.meta.verseCount) return;
  state.selected = index;
  $("#verseSearch").value = refOf(index);
  $("#selectedRef").textContent = refOf(index);
  $("#selectedText").textContent = state.verses[index] || "此版本没有对应文字，请核对节号。";
  const connections = state.neighbors[index].slice().sort((a, b) => state.votes[b] - state.votes[a]);
  $("#selectedLinks").textContent = `${format(connections.length)} 条关联`;
  $("#relatedCount").textContent = format(connections.length);
  const list = $("#relatedList");
  list.replaceChildren();
  for (const edge of connections.slice(0, 12)) {
    const other = state.src[edge] === index ? state.dst[edge] : state.src[edge];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "related-item";
    button.innerHTML = `<span class="related-item-top"><span>${escapeHtml(refOf(other))}</span><span>${state.votes[edge]} 票 ↗</span></span><small>${escapeHtml(state.verses[other] || "")}</small>`;
    button.addEventListener("click", () => selectVerse(other, { scroll: false }));
    list.append(button);
  }
  if (!connections.length) list.innerHTML = '<p class="loading-message">此节在数据集中没有关联。</p>';
  for (const button of $("#bookAxis").children) button.classList.toggle("selected", Number(button.dataset.book) === state.bookOf[index]);
  if (state.tab === "arcs") requestAnimationFrame(drawArcs);
  if (options.scroll) $("#atlas").scrollIntoView({ behavior: "smooth", block: "start" });
}

function edgeVisible(i) {
  const a = state.bookOf[state.src[i]];
  const b = state.bookOf[state.dst[i]];
  const scope = $("#relationFilter").value;
  const book = $("#bookFilter").value;
  if (state.votes[i] < Number($("#voteFilter").value)) return false;
  if (scope === "crossbook" && a === b) return false;
  if (scope === "within" && a !== b) return false;
  if (scope === "testament" && (a < 39) === (b < 39)) return false;
  if (book !== "all" && a !== Number(book) && b !== Number(book)) return false;
  if (state.pairFilter && !((a === state.pairFilter[0] && b === state.pairFilter[1]) || (b === state.pairFilter[0] && a === state.pairFilter[1]))) return false;
  return true;
}

function sampleArcs() {
  if (!state.src) return;
  const visible = [];
  for (let i = 0; i < state.src.length; i++) if (edgeVisible(i)) visible.push(i);
  state.filteredCount = visible.length;
  if (visible.length <= 6000) state.sample = visible;
  else {
    visible.sort((a, b) => state.votes[b] - state.votes[a]);
    const top = visible.slice(0, 2500);
    const rest = visible.slice(2500);
    const sampled = [];
    for (let i = 0; i < 3500; i++) sampled.push(rest[Math.floor(i * rest.length / 3500)]);
    state.sample = sampled.concat(top);
  }
  const pairText = state.pairFilter ? ` · ${state.meta.books[state.pairFilter[0]].zh} ↔ ${state.meta.books[state.pairFilter[1]].zh}` : "";
  $("#arcCount").textContent = `${format(visible.length)} 条符合筛选 · 绘制 ${format(state.sample.length)} 条${pairText}`;
  requestAnimationFrame(drawArcs);
}

function canvasSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function arcPath(ctx, a, b, width, base) {
  const left = 16 + (Math.min(a, b) / state.meta.verseCount) * (width - 32);
  const right = 16 + (Math.max(a, b) / state.meta.verseCount) * (width - 32);
  const distance = right - left;
  const rise = clamp(Math.sqrt(distance / width) * (base - 26) * 1.45, 10, base - 26);
  ctx.moveTo(left, base);
  ctx.quadraticCurveTo((left + right) / 2, base - rise * 2, right, base);
}

function drawArcs() {
  if (!state.src || state.tab !== "arcs") return;
  const { ctx, width, height } = canvasSize($("#arcCanvas"));
  if (width < 1) return;
  ctx.clearRect(0, 0, width, height);
  const base = height - 39;
  for (let i = 1; i < 6; i++) {
    ctx.beginPath(); ctx.moveTo(0, (height - 40) * i / 6); ctx.lineTo(width, (height - 40) * i / 6);
    ctx.strokeStyle = "rgba(255,255,255,.035)"; ctx.lineWidth = 1; ctx.stroke();
  }
  const split = 16 + (state.meta.books[39].start / state.meta.verseCount) * (width - 32);
  ctx.beginPath(); ctx.moveTo(split, 24); ctx.lineTo(split, base + 4); ctx.strokeStyle = "rgba(226,197,123,.35)"; ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]);
  const color = { old: "rgba(122,184,160,.15)", cross: "rgba(226,197,123,.20)", new: "rgba(125,170,199,.19)" };
  ctx.lineWidth = .72;
  for (const i of state.sample) {
    const a = state.src[i], b = state.dst[i];
    const bookA = state.bookOf[a], bookB = state.bookOf[b];
    ctx.beginPath(); arcPath(ctx, a, b, width, base);
    ctx.strokeStyle = bookA < 39 && bookB < 39 ? color.old : bookA >= 39 && bookB >= 39 ? color.new : color.cross;
    ctx.stroke();
  }
  const selectedEdges = state.neighbors[state.selected].slice().sort((a, b) => state.votes[b] - state.votes[a]).slice(0, 100);
  ctx.lineWidth = 1.4;
  ctx.shadowColor = "rgba(226,197,123,.65)"; ctx.shadowBlur = 5;
  for (const i of selectedEdges) {
    ctx.beginPath(); arcPath(ctx, state.src[i], state.dst[i], width, base);
    ctx.strokeStyle = "rgba(244,213,141,.65)"; ctx.stroke();
  }
  ctx.shadowBlur = 0;
  const x = 16 + state.selected / state.meta.verseCount * (width - 32);
  ctx.beginPath(); ctx.arc(x, base, 3.5, 0, Math.PI * 2); ctx.fillStyle = "#ffe09b"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(16, base); ctx.lineTo(width - 16, base); ctx.strokeStyle = "rgba(241,234,219,.78)"; ctx.lineWidth = 1; ctx.stroke();
  for (const book of state.meta.books) {
    const bx = 16 + book.start / state.meta.verseCount * (width - 32);
    ctx.beginPath(); ctx.moveTo(bx, base); ctx.lineTo(bx, base + (book.start === state.meta.books[39].start ? 14 : 7));
    ctx.strokeStyle = "rgba(241,234,219,.52)"; ctx.stroke();
  }
}

function buildMatrix() {
  const matrix = Array.from({ length: 66 }, () => new Uint32Array(66));
  let cross = 0, sameBook = 0;
  for (let i = 0; i < state.src.length; i++) {
    const a = state.bookOf[state.src[i]], b = state.bookOf[state.dst[i]];
    matrix[a][b]++;
    if (a !== b) matrix[b][a]++;
    if ((a < 39) !== (b < 39)) cross++;
    if (a === b) sameBook++;
  }
  state.matrix = matrix;
  state.crossCount = cross;
  state.sameBookCount = sameBook;
}

function cellInfo(row, col) {
  const count = state.matrix[row][col];
  const a = state.meta.books[row], b = state.meta.books[col];
  const possible = row === col ? a.count * (a.count - 1) / 2 : a.count * b.count;
  return { count, density: possible ? count / possible * 1e6 : 0, a, b };
}

function drawMatrix() {
  if (!state.matrix || state.tab !== "matrix") return;
  const canvas = $("#matrixCanvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = 760 * dpr; canvas.height = 760 * dpr;
  const ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#061014"; ctx.fillRect(0, 0, 760, 760);
  const x0 = 74, y0 = 74, cell = 10;
  let max = 0;
  for (let r = 0; r < 66; r++) for (let c = 0; c < 66; c++) {
    const info = cellInfo(r, c);
    const value = state.matrixMode === "count" ? info.count : info.density;
    max = Math.max(max, value);
  }
  for (let r = 0; r < 66; r++) for (let c = 0; c < 66; c++) {
    const info = cellInfo(r, c);
    const value = state.matrixMode === "count" ? info.count : info.density;
    const t = value ? Math.log1p(value) / Math.log1p(max) : 0;
    const alpha = value ? .14 + .82 * t : .025;
    const rgb = (r < 39) !== (c < 39) ? "226,197,123" : r < 39 ? "122,184,160" : "125,170,199";
    ctx.fillStyle = `rgba(${rgb},${alpha})`;
    ctx.fillRect(x0 + c * cell + .5, y0 + r * cell + .5, cell - 1, cell - 1);
  }
  ctx.strokeStyle = "rgba(226,197,123,.65)"; ctx.lineWidth = 1;
  const split = x0 + 39 * cell;
  ctx.beginPath(); ctx.moveTo(split, y0); ctx.lineTo(split, y0 + 660); ctx.moveTo(x0, split); ctx.lineTo(x0 + 660, split); ctx.stroke();
  if (state.hoveredMatrix) {
    const [r, c] = state.hoveredMatrix;
    ctx.strokeStyle = "#ffe09b"; ctx.lineWidth = 1.8;
    ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
  }
  ctx.fillStyle = "#aab9ad"; ctx.font = "8px ui-monospace, monospace";
  for (let i = 0; i < 66; i++) {
    const label = state.meta.books[i].abbr.toUpperCase().slice(0, 5);
    ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(label, x0 - 5, y0 + i * cell + cell / 2);
    ctx.save(); ctx.translate(x0 + i * cell + cell / 2, y0 - 5); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(label, 0, 0); ctx.restore();
  }
  ctx.fillStyle = "#e2c57b"; ctx.font = "700 10px ui-monospace, monospace";
  ctx.textAlign = "left"; ctx.fillText("OLD TESTAMENT", x0, 751); ctx.textAlign = "right"; ctx.fillText("NEW TESTAMENT", x0 + 660, 751);
}

function showFindings() {
  const total = state.src.length;
  const crossPct = state.crossCount / total * 100;
  const bookPairs = [];
  for (let a = 0; a < 39; a++) for (let b = 39; b < 66; b++) {
    const info = cellInfo(a, b);
    if (info.count >= 100) bookPairs.push({ bookA: a, bookB: b, ...info });
  }
  const byCount = bookPairs.slice().sort((a, b) => b.count - a.count)[0];
  const byDensity = bookPairs.slice().sort((a, b) => b.density - a.density)[0];
  const findings = [
    { number: `${crossPct.toFixed(1)}%`, title: "跨越新旧约的关联", body: `${format(state.crossCount)} 条逐节连线连接旧约与新约。它们呈现后来的经文如何不断回望先前的篇章。`, action: "只看跨约弧线 ↗", scope: "testament" },
    { number: format(byCount.count), title: `${byCount.a.zh} ↔ ${byCount.b.zh}`, body: "在跨约书卷配对中，这一组拥有最多逐节连线。数量容易受书卷篇幅影响，因此值得再看密度。", action: "观察这组书卷 ↗", pair: [byCount.bookA, byCount.bookB] },
    { number: byDensity.density.toFixed(0), title: `${byDensity.a.zh} ↔ ${byDensity.b.zh}`, body: `每百万个可能的经文配对中，有约 ${byDensity.density.toFixed(0)} 个被连起来；这是至少 100 条跨约连线的书卷配对中密度最高的一组。`, action: "观察隐藏的强联系 ↗", pair: [byDensity.bookA, byDensity.bookB] },
  ];
  const holder = $("#findings"); holder.replaceChildren();
  findings.forEach((finding, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "finding finding-button";
    button.innerHTML = `<span class="finding-index">0${index + 1} / OBSERVATION</span><strong class="finding-number">${escapeHtml(finding.number)}</strong><h3>${escapeHtml(finding.title)}</h3><p>${escapeHtml(finding.body)}</p><span class="finding-action">${escapeHtml(finding.action)}</span>`;
    button.addEventListener("click", () => {
      $("#bookFilter").value = "all";
      $("#voteFilter").value = "1";
      if (finding.scope) { state.pairFilter = null; $("#relationFilter").value = finding.scope; }
      if (finding.pair) { state.pairFilter = finding.pair; $("#relationFilter").value = "all"; }
      sampleArcs(); setTab("arcs"); $("#atlas").scrollIntoView({ behavior: "smooth" });
    });
    holder.append(button);
  });
}

function pathBetween(from, to) {
  if (from === to) return [from];
  const previous = new Int32Array(state.meta.verseCount); previous.fill(-1);
  const depth = new Uint8Array(state.meta.verseCount);
  const queue = new Uint32Array(state.meta.verseCount);
  let head = 0, tail = 0; queue[tail++] = from; previous[from] = from;
  while (head < tail) {
    const current = queue[head++];
    if (depth[current] >= 3) continue;
    for (const edge of state.neighbors[current]) {
      const next = state.src[edge] === current ? state.dst[edge] : state.src[edge];
      if (previous[next] !== -1) continue;
      previous[next] = current; depth[next] = depth[current] + 1;
      if (next === to) {
        const path = [to]; let node = to;
        while (node !== from) { node = previous[node]; path.push(node); }
        return path.reverse();
      }
      queue[tail++] = next;
    }
  }
  return null;
}

function renderPath(event) {
  event?.preventDefault();
  const from = parseRef($("#pathFrom").value), to = parseRef($("#pathTo").value);
  if (from == null || to == null) { $("#pathResult").textContent = "请输入有效经文地址，例如：创世纪 1:1 或 John 1:1。"; return; }
  const path = pathBetween(from, to);
  if (!path) { $("#pathResult").textContent = "在最多三步内没有找到关联。试试另一组经文；这不表示两段经文没有主题联系。"; return; }
  const holder = $("#pathResult");
  holder.innerHTML = `<p class="path-summary">${path.length === 1 ? "同一节经文" : `${path.length - 1} 步关联路径`}</p><div class="path-nodes"></div>`;
  const nodes = holder.querySelector(".path-nodes");
  path.forEach((index, position) => {
    if (position) { const arrow = document.createElement("span"); arrow.className = "path-connector"; arrow.textContent = "→"; nodes.append(arrow); }
    const button = document.createElement("button"); button.type = "button"; button.className = "path-node";
    button.innerHTML = `<strong>${escapeHtml(refOf(index))}</strong><span>${escapeHtml(state.verses[index] || "")}</span>`;
    button.addEventListener("click", () => selectVerse(index)); nodes.append(button);
  });
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.tab)));
  for (const id of ["relationFilter", "voteFilter", "bookFilter"]) $("#" + id).addEventListener("change", () => { state.pairFilter = null; sampleArcs(); });
  $("#verseSearchForm").addEventListener("submit", (event) => { event.preventDefault(); const index = parseRef($("#verseSearch").value); if (index == null) toast("找不到这节经文，请检查书名和节号。 "); else selectVerse(index); });
  $("#pathForm").addEventListener("submit", renderPath);
  $("#copyVerse").addEventListener("click", async () => { try { await navigator.clipboard.writeText(`${refOf(state.selected)} ${state.verses[state.selected]}`); toast("经文已复制"); } catch { toast("无法访问剪贴板"); } });
  $("#randomVerse").addEventListener("click", () => { const candidates = []; for (let i = 0; i < 300; i++) { const n = Math.floor(Math.random() * state.meta.verseCount); if (state.neighbors[n].length >= 10) candidates.push(n); } selectVerse(candidates[Math.floor(Math.random() * candidates.length)] ?? 0); });
  $("#themeButton").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = state.theme; localStorage.setItem("scripture-atlas-theme", state.theme); });
  $("#matrixCountButton").addEventListener("click", () => setMatrixMode("count"));
  $("#matrixDensityButton").addEventListener("click", () => setMatrixMode("density"));
  const arc = $("#arcCanvas");
  arc.addEventListener("pointermove", (event) => {
    const rect = arc.getBoundingClientRect(); const x = event.clientX - rect.left;
    const index = clamp(Math.floor((x - 16) / (rect.width - 32) * state.meta.verseCount), 0, state.meta.verseCount - 1);
    const tip = $("#arcTooltip"); tip.hidden = false; tip.textContent = `${refOf(index)} · 点击聚焦经文`;
    tip.style.left = `${clamp(x + 12, 8, rect.width - 175)}px`; tip.style.top = `${Math.max(36, event.clientY - rect.top - 35)}px`;
    arc.dataset.hoverIndex = String(index);
  });
  arc.addEventListener("pointerleave", () => { $("#arcTooltip").hidden = true; });
  arc.addEventListener("click", () => selectVerse(Number(arc.dataset.hoverIndex || 0)));
  const matrix = $("#matrixCanvas");
  matrix.addEventListener("pointermove", (event) => {
    const rect = matrix.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 760;
    const y = (event.clientY - rect.top) / rect.height * 760;
    const col = Math.floor((x - 74) / 10), row = Math.floor((y - 74) / 10);
    const tip = $("#matrixTooltip");
    if (row < 0 || row > 65 || col < 0 || col > 65) { tip.hidden = true; state.hoveredMatrix = null; drawMatrix(); return; }
    state.hoveredMatrix = [row, col];
    const info = cellInfo(row, col);
    tip.hidden = false; tip.innerHTML = `${escapeHtml(info.a.zh)} ↔ ${escapeHtml(info.b.zh)}<br>${format(info.count)} 条 · 密度 ${info.density.toFixed(1)} / 百万`;
    tip.style.left = `${clamp(x + 12, 8, 540)}px`; tip.style.top = `${clamp(y - 20, 8, 700)}px`;
    $("#matrixNote").textContent = `${info.a.zh} ↔ ${info.b.zh}：${format(info.count)} 条逐节关联。点击查看其弧线。`;
    drawMatrix();
  });
  matrix.addEventListener("pointerleave", () => { $("#matrixTooltip").hidden = true; state.hoveredMatrix = null; drawMatrix(); });
  matrix.addEventListener("click", () => { if (!state.hoveredMatrix) return; state.pairFilter = state.hoveredMatrix; $("#relationFilter").value = "all"; $("#bookFilter").value = "all"; $("#voteFilter").value = "1"; sampleArcs(); setTab("arcs"); });
  window.addEventListener("resize", () => { if (state.tab === "arcs") drawArcs(); });
}

function setMatrixMode(mode) {
  state.matrixMode = mode;
  for (const [id, value] of [["matrixCountButton", "count"], ["matrixDensityButton", "density"]]) {
    const button = $("#" + id); const selected = mode === value;
    button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected));
  }
  drawMatrix();
}

async function load() {
  try {
    const [metaResponse, versesResponse, edgesResponse] = await Promise.all([
      fetch("data/meta.json"), fetch("data/verses.json"), fetch("data/references.bin"),
    ]);
    if (!metaResponse.ok || !versesResponse.ok || !edgesResponse.ok) throw new Error("数据文件无法载入");
    state.meta = await metaResponse.json();
    state.verses = await versesResponse.json();
    const buffer = await edgesResponse.arrayBuffer();
    if (buffer.byteLength % 12) throw new Error("关联数据格式不正确");
    const count = buffer.byteLength / 12, view = new DataView(buffer);
    state.src = new Uint32Array(count); state.dst = new Uint32Array(count); state.votes = new Int32Array(count);
    state.bookOf = new Uint8Array(state.meta.verseCount);
    state.chapterOf = new Uint8Array(state.meta.verseCount);
    state.numberOf = new Uint8Array(state.meta.verseCount);
    state.neighbors = Array.from({ length: state.meta.verseCount }, () => []);
    state.meta.books.forEach((book, bookIndex) => {
      let index = book.start;
      book.chapters.forEach((length, chapterIndex) => { for (let verse = 1; verse <= length; verse++) { state.bookOf[index] = bookIndex; state.chapterOf[index] = chapterIndex + 1; state.numberOf[index] = verse; index++; } });
    });
    for (let i = 0; i < count; i++) {
      const at = i * 12, a = view.getUint32(at, true), b = view.getUint32(at + 4, true);
      state.src[i] = a; state.dst[i] = b; state.votes[i] = view.getInt32(at + 8, true);
      state.neighbors[a].push(i); state.neighbors[b].push(i);
    }
    buildMatrix();
    $("#statVerses").textContent = format(state.meta.verseCount);
    $("#statReferences").textContent = format(state.meta.sourceRows);
    $("#statBooks").textContent = state.meta.books.length;
    $("#skippedRows").textContent = format(state.meta.skippedRows);
    $("#nonpositivePairs").textContent = format(state.meta.nonpositivePairs);
    $("#loadState").textContent = `${format(state.meta.edgeCount)} 条逐节连线 · 就绪`;
    state.meta.books.forEach((book, index) => {
      const option = document.createElement("option"); option.value = String(index); option.textContent = book.zh; $("#bookFilter").append(option);
      const button = document.createElement("button"); button.type = "button"; button.dataset.book = String(index);
      button.style.flex = `${book.count} 1 0`; button.style.setProperty("--axis-color", index < 39 ? "#548878" : "#617f95");
      button.title = `${book.zh} · ${format(book.count)} 节`;
      button.setAttribute("aria-label", `聚焦${book.zh}`);
      button.addEventListener("click", () => { state.pairFilter = null; $("#bookFilter").value = String(index); sampleArcs(); selectVerse(book.start); });
      $("#bookAxis").append(button);
    });
    bindEvents(); sampleArcs(); selectVerse(0); showFindings(); renderPath();
  } catch (error) {
    $("#loadState").textContent = `载入失败：${error.message}`;
    $("#selectedText").textContent = "请刷新页面重试。";
    console.error(error);
  }
}

state.theme = localStorage.getItem("scripture-atlas-theme") === "light" ? "light" : "dark";
document.documentElement.dataset.theme = state.theme;
load();
