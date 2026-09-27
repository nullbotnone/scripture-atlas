const LANGS = ["zh", "tw", "en"];
const VERSE_FILES = { zh: "data/verses.json", tw: "data/verses.tw.json", en: "data/verses.en.json" };
const OPENBIBLE = '<a href="https://www.openbible.info/labs/cross-references/" target="_blank" rel="noopener">OpenBible.info</a>';
const OPEN_BIBLES = 'href="https://github.com/seven1m/open-bibles" target="_blank" rel="noopener"';

const UI = {
  zh: {
    htmlLang: "zh-CN", title: "经纬圣经 · Scripture Atlas | slashai.app",
    description: "经纬圣经：探索整本圣经经文之间的关联、跨卷回声与两节经文之间的路径。",
    skip: "跳到探索工具", brandLabel: "返回 slashai.app 首页", navLabel: "页面导航",
    navExplore: "探索", navDiscover: "发现", navMethod: "方法", themeLabel: "切换明暗主题",
    heroTitle: "让经文之间的<br/><em>回声</em>，看得见。",
    heroCopy: "从创世记到启示录，沿着每一条跨越篇章的线索，重新阅读这本彼此呼应的书。选一节经文，看看它把你带向哪里。",
    heroStart: '开始探索 <span aria-hidden="true">↗</span>', heroMethod: '了解数据与方法 <span aria-hidden="true">↘</span>',
    statsLabel: "数据规模", statVerses: "节经文", statRefs: "条原始交叉引用", statBooks: "卷书", ot: "旧约", nt: "新约",
    workspaceTitle: "探索经文的结构", workspaceLede: "同一批经文关联，以三种尺度呈现：<br/>看全貌、比较书卷、沿线索逐节行走。",
    loading: "正在载入数据…", tabsLabel: "可视化模式", tabArcs: "关联穹顶", tabMatrix: "书卷矩阵", tabPath: "经文路径",
    arcTitle: "整本圣经，一道关系的穹顶。",
    arcCopy: "每一道弧线连接两节经文；弧线越高，跨越的篇幅越远。点击下方时间轴或搜索经文，追踪属于它的线索。",
    relation: "关系范围", relAll: "全部关联", relCross: "跨书卷", relTestament: "跨新旧约", relWithin: "同一书卷",
    votes: "最低票数", voteAll: "全部正票", vote20: "20 票以上", vote50: "50 票以上", vote100: "100 票以上",
    focusBook: "聚焦书卷", allBooks: "全部 66 卷",
    arcCanvas: "圣经经文交叉引用弧线图。可通过下方筛选和经文搜索操作。", axisOT: "旧约 / 39 卷", axisNT: "新约 / 27 卷",
    bookAxis: "按书卷位置选择经文",
    keyOld: '<i class="key key-teal"></i>旧约内部', keyCross: '<i class="key key-gold"></i>跨新旧约', keyNew: '<i class="key key-blue"></i>新约内部',
    captionRight: "视图最多绘制 6,000 条，统计基于完整数据",
    matrixTitle: "哪些书卷，隔空对话？",
    matrixCopy: "每个方格代表两卷书之间的关联。切换“关系密度”，可看见篇幅较短的书卷所隐藏的强联系。点击格子，回到弧线图细看。",
    matrixSize: "66 × 66 书卷", matrixMetric: "矩阵度量", matrixCount: "关联数量", matrixDensity: "关系密度",
    matrixCanvas: "66 卷书卷交叉引用矩阵。", matrixHint: "移动到方格查看书卷之间的关联。",
    pathTitle: "两节经文之间，有路可走吗？",
    pathCopy: "输入两个经文地址，寻找最多三步的交叉引用路径。中间的经文可能是你未曾想到的桥梁；点击节点即可继续探索。",
    pathFrom: "起点经文", pathTo: "终点经文", fromPh: "例如：创世纪 1:1", toPh: "例如：约翰福音 1:1",
    pathSubmit: '寻找路径 <span aria-hidden="true">↗</span>', pathIdle: "载入完成后，按“寻找路径”开始。",
    detailLabel: "经文详情", detailTop: "VERSE FOCUS / 经文焦点", searchLabel: "前往某节经文", searchPh: "如：约翰福音 3:16",
    searchButton: "搜索经文", searchHelp: "支持中文书名或英文缩写，如 John 3:16", loadingVerse: "正在载入经文…",
    copy: "复制 ↗", related: "相连的经文", loadingLinks: "正在整理关联…", random: '偶遇一节经文 <span aria-hidden="true">↗</span>',
    discTitle: "从图形里，发现问题", discLede: "以下数字由完整关联网络计算。它们是阅读的起点，而不是对经文本意的自动判定。",
    loadingFindings: "正在计算跨卷关系…", tryAsking: "试着追问",
    prompt: "为什么有些新约书卷频繁回望某一卷旧约？一节经文的“邻居”究竟在谈相同的词、事件，还是神学主题？",
    methodTitle: "看见连线，也看见它的边界。",
    m1Title: "连线从哪里来", m1Body: `交叉引用来自 ${OPENBIBLE}（CC BY），主要汇集《经文汇编》及读者投票。票数表示该数据集中对关联的评价，不能当作释经结论或写作年代。`,
    m2Title: "如何变成“节到节”", m2Body: '原始引用有时指向一个节段。本站将节段展开成逐节连接，同一对经文去重并保留较高票数；<span id="nonpositivePairs">—</span> 个非正票配对未收入图中。原始行数与连线数因此不同。',
    m3Title: "经文与编号", m3Body: `经文来自 <a ${OPEN_BIBLES}>open-bibles 的公版和合本简体</a>。不同版本的节号划分略有差异；与本版不匹配的 <span id="skippedRows">—</span> 行引用已跳过。请返回上下文阅读经文。`,
    sourceLink: "查看源码 ↗", footer: "愿每一次新的连接，带你回到经文本身。",
    noText: "此版本没有对应文字，请核对节号。", links: (n) => `${n} 条关联`, votesN: (n) => `${n} 票`,
    noLinks: "此节在数据集中没有关联。", arcCount: (v, d) => `${v} 条符合筛选 · 绘制 ${d} 条`,
    crossTitle: "跨越新旧约的关联", crossBody: (n) => `${n} 条逐节连线连接旧约与新约。它们呈现后来的经文如何不断回望先前的篇章。`, crossAction: "只看跨约弧线 ↗",
    pairBody: "在跨约书卷配对中，这一组拥有最多逐节连线。数量容易受书卷篇幅影响，因此值得再看密度。", pairAction: "观察这组书卷 ↗",
    densityBody: (d) => `每百万个可能的经文配对中，有约 ${d} 个被连起来；这是至少 100 条跨约连线的书卷配对中密度最高的一组。`, densityAction: "观察隐藏的强联系 ↗",
    pathInvalid: "请输入有效经文地址，例如：创世纪 1:1 或 John 1:1。", pathNone: "在最多三步内没有找到关联。试试另一组经文；这不表示两段经文没有主题联系。",
    pathSame: "同一节经文", pathSteps: (n) => `${n} 步关联路径`, notFound: "找不到这节经文，请检查书名和节号。",
    copied: "经文已复制", clipFail: "无法访问剪贴板", arcHover: "点击聚焦经文",
    matrixTip: (c, d) => `${c} 条 · 密度 ${d} / 百万`, matrixNote: (c) => `${c} 条逐节关联。点击查看其弧线。`, sep: "：",
    ready: (n) => `${n} 条逐节连线 · 就绪`, loadFail: (m) => `载入失败：${m}`, retry: "请刷新页面重试。",
    bookTitle: (b, n) => `${b} · ${n} 节`, bookFocus: (b) => `聚焦${b}`,
  },
  tw: {
    htmlLang: "zh-TW", title: "經緯聖經 · Scripture Atlas | slashai.app",
    description: "經緯聖經：探索整本聖經經文之間的關聯、跨卷迴聲與兩節經文之間的路徑。",
    skip: "跳到探索工具", brandLabel: "返回 slashai.app 首頁", navLabel: "頁面導覽",
    navExplore: "探索", navDiscover: "發現", navMethod: "方法", themeLabel: "切換明暗主題",
    heroTitle: "讓經文之間的<br/><em>迴聲</em>，看得見。",
    heroCopy: "從創世記到啟示錄，沿著每一條跨越篇章的線索，重新閱讀這本彼此呼應的書。選一節經文，看看它把你帶向哪裡。",
    heroStart: '開始探索 <span aria-hidden="true">↗</span>', heroMethod: '了解資料與方法 <span aria-hidden="true">↘</span>',
    statsLabel: "資料規模", statVerses: "節經文", statRefs: "條原始交叉引用", statBooks: "卷書", ot: "舊約", nt: "新約",
    workspaceTitle: "探索經文的結構", workspaceLede: "同一批經文關聯，以三種尺度呈現：<br/>看全貌、比較書卷、沿線索逐節行走。",
    loading: "正在載入資料…", tabsLabel: "視覺化模式", tabArcs: "關聯穹頂", tabMatrix: "書卷矩陣", tabPath: "經文路徑",
    arcTitle: "整本聖經，一道關係的穹頂。",
    arcCopy: "每一道弧線連接兩節經文；弧線越高，跨越的篇幅越遠。點擊下方時間軸或搜尋經文，追蹤屬於它的線索。",
    relation: "關係範圍", relAll: "全部關聯", relCross: "跨書卷", relTestament: "跨新舊約", relWithin: "同一書卷",
    votes: "最低票數", voteAll: "全部正票", vote20: "20 票以上", vote50: "50 票以上", vote100: "100 票以上",
    focusBook: "聚焦書卷", allBooks: "全部 66 卷",
    arcCanvas: "聖經經文交叉引用弧線圖。可透過下方篩選和經文搜尋操作。", axisOT: "舊約 / 39 卷", axisNT: "新約 / 27 卷",
    bookAxis: "按書卷位置選擇經文",
    keyOld: '<i class="key key-teal"></i>舊約內部', keyCross: '<i class="key key-gold"></i>跨新舊約', keyNew: '<i class="key key-blue"></i>新約內部',
    captionRight: "視圖最多繪製 6,000 條，統計基於完整資料",
    matrixTitle: "哪些書卷，隔空對話？",
    matrixCopy: "每個方格代表兩卷書之間的關聯。切換「關係密度」，可看見篇幅較短的書卷所隱藏的強聯繫。點擊格子，回到弧線圖細看。",
    matrixSize: "66 × 66 書卷", matrixMetric: "矩陣度量", matrixCount: "關聯數量", matrixDensity: "關係密度",
    matrixCanvas: "66 卷書卷交叉引用矩陣。", matrixHint: "移動到方格查看書卷之間的關聯。",
    pathTitle: "兩節經文之間，有路可走嗎？",
    pathCopy: "輸入兩個經文地址，尋找最多三步的交叉引用路徑。中間的經文可能是你未曾想到的橋樑；點擊節點即可繼續探索。",
    pathFrom: "起點經文", pathTo: "終點經文", fromPh: "例如：創世紀 1:1", toPh: "例如：約翰福音 1:1",
    pathSubmit: '尋找路徑 <span aria-hidden="true">↗</span>', pathIdle: "載入完成後，按「尋找路徑」開始。",
    detailLabel: "經文詳情", detailTop: "VERSE FOCUS / 經文焦點", searchLabel: "前往某節經文", searchPh: "如：約翰福音 3:16",
    searchButton: "搜尋經文", searchHelp: "支援中文書名或英文縮寫，如 John 3:16", loadingVerse: "正在載入經文…",
    copy: "複製 ↗", related: "相連的經文", loadingLinks: "正在整理關聯…", random: '偶遇一節經文 <span aria-hidden="true">↗</span>',
    discTitle: "從圖形裡，發現問題", discLede: "以下數字由完整關聯網絡計算。它們是閱讀的起點，而不是對經文本意的自動判定。",
    loadingFindings: "正在計算跨卷關係…", tryAsking: "試著追問",
    prompt: "為什麼有些新約書卷頻繁回望某一卷舊約？一節經文的「鄰居」究竟在談相同的詞、事件，還是神學主題？",
    methodTitle: "看見連線，也看見它的邊界。",
    m1Title: "連線從哪裡來", m1Body: `交叉引用來自 ${OPENBIBLE}（CC BY），主要匯集《經文彙編》及讀者投票。票數表示該資料集中對關聯的評價，不能當作釋經結論或寫作年代。`,
    m2Title: "如何變成「節到節」", m2Body: '原始引用有時指向一個節段。本站將節段展開成逐節連接，同一對經文去重並保留較高票數；<span id="nonpositivePairs">—</span> 個非正票配對未收入圖中。原始行數與連線數因此不同。',
    m3Title: "經文與編號", m3Body: `經文來自 <a ${OPEN_BIBLES}>open-bibles 的公版和合本繁體</a>。不同版本的節號劃分略有差異；與和合本不匹配的 <span id="skippedRows">—</span> 行引用已跳過。請返回上下文閱讀經文。`,
    sourceLink: "查看原始碼 ↗", footer: "願每一次新的連接，帶你回到經文本身。",
    noText: "此版本沒有對應文字，請核對節號。", links: (n) => `${n} 條關聯`, votesN: (n) => `${n} 票`,
    noLinks: "此節在資料集中沒有關聯。", arcCount: (v, d) => `${v} 條符合篩選 · 繪製 ${d} 條`,
    crossTitle: "跨越新舊約的關聯", crossBody: (n) => `${n} 條逐節連線連接舊約與新約。它們呈現後來的經文如何不斷回望先前的篇章。`, crossAction: "只看跨約弧線 ↗",
    pairBody: "在跨約書卷配對中，這一組擁有最多逐節連線。數量容易受書卷篇幅影響，因此值得再看密度。", pairAction: "觀察這組書卷 ↗",
    densityBody: (d) => `每百萬個可能的經文配對中，有約 ${d} 個被連起來；這是至少 100 條跨約連線的書卷配對中密度最高的一組。`, densityAction: "觀察隱藏的強聯繫 ↗",
    pathInvalid: "請輸入有效經文地址，例如：創世紀 1:1 或 John 1:1。", pathNone: "在最多三步內沒有找到關聯。試試另一組經文；這不表示兩段經文沒有主題聯繫。",
    pathSame: "同一節經文", pathSteps: (n) => `${n} 步關聯路徑`, notFound: "找不到這節經文，請檢查書名和節號。",
    copied: "經文已複製", clipFail: "無法存取剪貼簿", arcHover: "點擊聚焦經文",
    matrixTip: (c, d) => `${c} 條 · 密度 ${d} / 百萬`, matrixNote: (c) => `${c} 條逐節關聯。點擊查看其弧線。`, sep: "：",
    ready: (n) => `${n} 條逐節連線 · 就緒`, loadFail: (m) => `載入失敗：${m}`, retry: "請重新整理頁面再試。",
    bookTitle: (b, n) => `${b} · ${n} 節`, bookFocus: (b) => `聚焦${b}`,
  },
  en: {
    htmlLang: "en", title: "Scripture Atlas | slashai.app",
    description: "Scripture Atlas: explore how verses across the whole Bible connect, where the books echo each other, and the paths between any two verses.",
    skip: "Skip to the explorer", brandLabel: "Back to the slashai.app home page", navLabel: "Page navigation",
    navExplore: "Explore", navDiscover: "Observations", navMethod: "Method", themeLabel: "Toggle light and dark theme",
    heroTitle: "Make the <em>echoes</em><br/>between verses visible.",
    heroCopy: "From Genesis to Revelation, follow every thread that crosses from one passage to another, and read the Bible again as a book that answers itself. Pick a verse and see where it takes you.",
    heroStart: 'Start exploring <span aria-hidden="true">↗</span>', heroMethod: 'About the data and method <span aria-hidden="true">↘</span>',
    statsLabel: "Dataset size", statVerses: "verses", statRefs: "raw cross-references", statBooks: "books", ot: "Old Testament", nt: "New Testament",
    workspaceTitle: "Explore the shape of Scripture", workspaceLede: "One set of cross-references at three scales:<br/>the whole picture, book against book, verse by verse.",
    loading: "Loading data…", tabsLabel: "Visualization mode", tabArcs: "Arc of connections", tabMatrix: "Book matrix", tabPath: "Verse paths",
    arcTitle: "The whole Bible under one arch of connections.",
    arcCopy: "Each arc joins two verses; the higher the arc, the farther apart they sit. Click the timeline below or search for a verse to trace its threads.",
    relation: "Scope", relAll: "All connections", relCross: "Across books", relTestament: "Across testaments", relWithin: "Within a book",
    votes: "Minimum votes", voteAll: "All positive votes", vote20: "20+ votes", vote50: "50+ votes", vote100: "100+ votes",
    focusBook: "Focus on a book", allBooks: "All 66 books",
    arcCanvas: "Arc diagram of Bible cross-references. Use the filters and verse search below.", axisOT: "Old Testament / 39 books", axisNT: "New Testament / 27 books",
    bookAxis: "Pick a verse by its book's position",
    keyOld: '<i class="key key-teal"></i>Within the OT', keyCross: '<i class="key key-gold"></i>OT ↔ NT', keyNew: '<i class="key key-blue"></i>Within the NT',
    captionRight: "Draws at most 6,000 arcs; statistics use the full dataset",
    matrixTitle: "Which books talk to each other?",
    matrixCopy: "Each cell is the set of links between two books. Switch to “Density” to reveal strong ties hidden in shorter books. Click a cell to see its arcs.",
    matrixSize: "66 × 66 books", matrixMetric: "Matrix metric", matrixCount: "Count", matrixDensity: "Density",
    matrixCanvas: "Cross-reference matrix of the 66 books.", matrixHint: "Hover over a cell to see the links between two books.",
    pathTitle: "Is there a path between two verses?",
    pathCopy: "Enter two references to find a cross-reference path of up to three steps. The verses in between may be bridges you never expected; click any node to keep exploring.",
    pathFrom: "From", pathTo: "To", fromPh: "e.g. Genesis 1:1", toPh: "e.g. John 1:1",
    pathSubmit: 'Find a path <span aria-hidden="true">↗</span>', pathIdle: "Once the data loads, press “Find a path”.",
    detailLabel: "Verse details", detailTop: "VERSE FOCUS", searchLabel: "Go to a verse", searchPh: "e.g. John 3:16",
    searchButton: "Search verse", searchHelp: "English or Chinese book names and abbreviations work, e.g. Rom 8:28", loadingVerse: "Loading verse…",
    copy: "Copy ↗", related: "Connected verses", loadingLinks: "Gathering connections…", random: 'Stumble on a verse <span aria-hidden="true">↗</span>',
    discTitle: "Questions the picture raises", discLede: "These numbers come from the full network. They are places to start reading, not automatic verdicts on what a text means.",
    loadingFindings: "Computing cross-book links…", tryAsking: "Try asking",
    prompt: "Why do some New Testament books keep looking back to one particular Old Testament book? Are a verse’s “neighbors” sharing words, events, or theology?",
    methodTitle: "See the lines, and their limits.",
    m1Title: "Where the links come from", m1Body: `Cross-references come from ${OPENBIBLE} (CC BY), drawn mainly from the Treasury of Scripture Knowledge plus reader votes. Votes rate a link within that dataset; they are not an interpretation or a dating of the text.`,
    m2Title: "Turning ranges into verse pairs", m2Body: 'A source reference sometimes points to a range. The atlas expands ranges into verse-to-verse links, merges duplicate pairs and keeps the higher vote; <span id="nonpositivePairs">—</span> pairs with no positive votes are left out. That is why raw rows and drawn links differ.',
    m3Title: "Text and numbering", m3Body: `English text is the public-domain King James Version from <a ${OPEN_BIBLES}>open-bibles</a>. Verse numbering follows the Chinese Union Version the atlas is built on, so <span id="skippedRows">—</span> reference rows that do not fit it were skipped, and a few verses the KJV numbers differently may be blank or shifted. Always read a verse in its context.`,
    sourceLink: "View source ↗", footer: "May every new connection lead you back to the text itself.",
    noText: "This translation has no text at this number. Check the verse numbering.", links: (n) => `${n} connections`, votesN: (n) => `${n} votes`,
    noLinks: "This verse has no connections in the dataset.", arcCount: (v, d) => `${v} match · ${d} drawn`,
    crossTitle: "Links across the testaments", crossBody: (n) => `${n} verse-to-verse links join the Old and New Testaments, showing how later texts keep looking back to earlier ones.`, crossAction: "Show only cross-testament arcs ↗",
    pairBody: "Among Old–New Testament book pairs, this one has the most verse links. Counts favor long books, so check the density too.", pairAction: "Look at this pair ↗",
    densityBody: (d) => `About ${d} of every million possible verse pairs are linked, the highest density among book pairs with at least 100 cross-testament links.`, densityAction: "See the hidden strong tie ↗",
    pathInvalid: "Enter valid references, e.g. Genesis 1:1 or 创世纪 1:1.", pathNone: "No link within three steps. Try another pair; this does not mean the passages share no theme.",
    pathSame: "The same verse", pathSteps: (n) => `${n}-step path`, notFound: "Couldn't find that verse. Check the book name and numbers.",
    copied: "Verse copied", clipFail: "Clipboard unavailable", arcHover: "click to focus",
    matrixTip: (c, d) => `${c} links · density ${d} / million`, matrixNote: (c) => `${c} verse links. Click to see the arcs.`, sep: ": ",
    ready: (n) => `${n} verse links · ready`, loadFail: (m) => `Failed to load: ${m}`, retry: "Please reload the page.",
    bookTitle: (b, n) => `${b} · ${n} verses`, bookFocus: (b) => `Focus on ${b}`,
  },
};

const pickLang = () => {
  try { const saved = JSON.parse(localStorage.getItem("slashai.lang")); if (LANGS.includes(saved)) return saved; } catch { /* private mode */ }
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return /hant|tw|hk|mo/.test(nav) ? "tw" : "zh";
  return "en";
};

const $ = (selector) => document.querySelector(selector);
const t = () => UI[state.lang];
const format = (number) => new Intl.NumberFormat(t().htmlLang).format(number);
const bookName = (book) => book[state.lang] || book.zh;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

const state = {
  meta: null, verses: null, src: null, dst: null, votes: null, bookOf: null,
  chapterOf: null, numberOf: null, neighbors: null, matrix: null,
  selected: 0, tab: "arcs", sample: [], filteredCount: 0, pairFilter: null,
  matrixMode: "count", hoveredMatrix: null, theme: "dark", lang: pickLang(), versesByLang: {},
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
  return `${short ? book.abbr : bookName(book)} ${state.chapterOf[index]}:${state.numberOf[index]}`;
}

function parseRef(value) {
  const match = value.trim().match(/^(.+?)[\s.]+(\d+)\s*[:：.]\s*(\d+)$/) || value.trim().match(/^(.+?)(\d+)\s*[:：.]\s*(\d+)$/);
  if (!match) return null;
  const name = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const chapter = Number(match[2]);
  const verse = Number(match[3]);
  const book = state.meta.books.find((item) => [item.zh, item.tw, item.en, item.abbr].some((label) => label?.toLowerCase() === name));
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
  $("#selectedText").textContent = state.verses[index] || t().noText;
  const connections = state.neighbors[index].slice().sort((a, b) => state.votes[b] - state.votes[a]);
  $("#selectedLinks").textContent = t().links(format(connections.length));
  $("#relatedCount").textContent = format(connections.length);
  const list = $("#relatedList");
  list.replaceChildren();
  for (const edge of connections.slice(0, 12)) {
    const other = state.src[edge] === index ? state.dst[edge] : state.src[edge];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "related-item";
    button.innerHTML = `<span class="related-item-top"><span>${escapeHtml(refOf(other))}</span><span>${t().votesN(state.votes[edge])} ↗</span></span><small>${escapeHtml(state.verses[other] || "")}</small>`;
    button.addEventListener("click", () => selectVerse(other, { scroll: false }));
    list.append(button);
  }
  if (!connections.length) list.innerHTML = `<p class="loading-message">${t().noLinks}</p>`;
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
  const pairText = state.pairFilter ? ` · ${bookName(state.meta.books[state.pairFilter[0]])} ↔ ${bookName(state.meta.books[state.pairFilter[1]])}` : "";
  $("#arcCount").textContent = t().arcCount(format(visible.length), format(state.sample.length)) + pairText;
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
    { number: `${crossPct.toFixed(1)}%`, title: t().crossTitle, body: t().crossBody(format(state.crossCount)), action: t().crossAction, scope: "testament" },
    { number: format(byCount.count), title: `${bookName(byCount.a)} ↔ ${bookName(byCount.b)}`, body: t().pairBody, action: t().pairAction, pair: [byCount.bookA, byCount.bookB] },
    { number: byDensity.density.toFixed(0), title: `${bookName(byDensity.a)} ↔ ${bookName(byDensity.b)}`, body: t().densityBody(byDensity.density.toFixed(0)), action: t().densityAction, pair: [byDensity.bookA, byDensity.bookB] },
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
  if (from == null || to == null) { $("#pathResult").textContent = t().pathInvalid; return; }
  const path = pathBetween(from, to);
  if (!path) { $("#pathResult").textContent = t().pathNone; return; }
  const holder = $("#pathResult");
  holder.innerHTML = `<p class="path-summary">${path.length === 1 ? t().pathSame : t().pathSteps(path.length - 1)}</p><div class="path-nodes"></div>`;
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
  $("#verseSearchForm").addEventListener("submit", (event) => { event.preventDefault(); const index = parseRef($("#verseSearch").value); if (index == null) toast(t().notFound); else selectVerse(index); });
  $("#pathForm").addEventListener("submit", renderPath);
  $("#copyVerse").addEventListener("click", async () => { try { await navigator.clipboard.writeText(`${refOf(state.selected)} ${state.verses[state.selected]}`); toast(t().copied); } catch { toast(t().clipFail); } });
  $("#randomVerse").addEventListener("click", () => { const candidates = []; for (let i = 0; i < 300; i++) { const n = Math.floor(Math.random() * state.meta.verseCount); if (state.neighbors[n].length >= 10) candidates.push(n); } selectVerse(candidates[Math.floor(Math.random() * candidates.length)] ?? 0); });
  $("#themeButton").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = state.theme; localStorage.setItem("scripture-atlas-theme", state.theme); });
  $("#matrixCountButton").addEventListener("click", () => setMatrixMode("count"));
  $("#matrixDensityButton").addEventListener("click", () => setMatrixMode("density"));
  const arc = $("#arcCanvas");
  arc.addEventListener("pointermove", (event) => {
    const rect = arc.getBoundingClientRect(); const x = event.clientX - rect.left;
    const index = clamp(Math.floor((x - 16) / (rect.width - 32) * state.meta.verseCount), 0, state.meta.verseCount - 1);
    const tip = $("#arcTooltip"); tip.hidden = false; tip.textContent = `${refOf(index)} · ${t().arcHover}`;
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
    tip.hidden = false; tip.innerHTML = `${escapeHtml(bookName(info.a))} ↔ ${escapeHtml(bookName(info.b))}<br>${t().matrixTip(format(info.count), info.density.toFixed(1))}`;
    tip.style.left = `${clamp(x + 12, 8, 540)}px`; tip.style.top = `${clamp(y - 20, 8, 700)}px`;
    $("#matrixNote").textContent = `${bookName(info.a)} ↔ ${bookName(info.b)}${t().sep}${t().matrixNote(format(info.count))}`;
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

async function loadVerses(lang) {
  if (!state.versesByLang[lang]) {
    const response = await fetch(VERSE_FILES[lang]);
    if (!response.ok) throw new Error(VERSE_FILES[lang]);
    state.versesByLang[lang] = await response.json();
  }
  return state.versesByLang[lang];
}

function applyStatic() {
  const ui = t();
  document.documentElement.lang = ui.htmlLang;
  document.title = ui.title;
  $("#metaDescription").content = ui.description;
  for (const element of document.querySelectorAll("[data-i18n]")) element.innerHTML = ui[element.dataset.i18n];
  for (const element of document.querySelectorAll("[data-i18n-attr]")) {
    for (const pair of element.dataset.i18nAttr.split(" ")) { const [attr, key] = pair.split(":"); element.setAttribute(attr, ui[key]); }
  }
  for (const button of $("#langSeg").children) button.setAttribute("aria-pressed", String(button.dataset.lang === state.lang));
}

// Everything built from data, redrawn in the current language.
function render() {
  const ui = t();
  $("#statVerses").textContent = format(state.meta.verseCount);
  $("#statReferences").textContent = format(state.meta.sourceRows);
  $("#statBooks").textContent = state.meta.books.length;
  $("#skippedRows").textContent = format(state.meta.skippedRows);
  $("#nonpositivePairs").textContent = format(state.meta.nonpositivePairs);
  $("#loadState").textContent = ui.ready(format(state.meta.edgeCount));
  state.meta.books.forEach((book, index) => {
    $("#bookFilter").options[index + 1].textContent = bookName(book);
    const button = $("#bookAxis").children[index];
    button.title = ui.bookTitle(bookName(book), format(book.count));
    button.setAttribute("aria-label", ui.bookFocus(bookName(book)));
  });
  for (const input of [$("#pathFrom"), $("#pathTo")]) { const index = parseRef(input.value); if (index != null) input.value = refOf(index); }
  sampleArcs(); selectVerse(state.selected); showFindings(); renderPath();
}

async function setLang(lang) {
  state.lang = lang;
  try { localStorage.setItem("slashai.lang", JSON.stringify(lang)); } catch { /* private mode */ }
  applyStatic();
  if (!state.meta) return;
  try {
    const verses = await loadVerses(lang);
    if (state.lang !== lang) return;
    state.verses = verses;
    render();
  } catch (error) { toast(t().loadFail(error.message)); }
}

async function load() {
  try {
    const [metaResponse, edgesResponse] = await Promise.all([fetch("data/meta.json"), fetch("data/references.bin"), loadVerses(state.lang)]);
    if (!metaResponse.ok || !edgesResponse.ok) throw new Error("data/meta.json, data/references.bin");
    state.meta = await metaResponse.json();
    state.verses = await loadVerses(state.lang); // the language may have changed while loading
    const buffer = await edgesResponse.arrayBuffer();
    if (buffer.byteLength % 12) throw new Error("data/references.bin");
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
    state.meta.books.forEach((book, index) => {
      const option = document.createElement("option"); option.value = String(index); $("#bookFilter").append(option);
      const button = document.createElement("button"); button.type = "button"; button.dataset.book = String(index);
      button.style.flex = `${book.count} 1 0`; button.style.setProperty("--axis-color", index < 39 ? "#548878" : "#617f95");
      button.addEventListener("click", () => { state.pairFilter = null; $("#bookFilter").value = String(index); sampleArcs(); selectVerse(book.start); });
      $("#bookAxis").append(button);
    });
    bindEvents(); render();
  } catch (error) {
    $("#loadState").textContent = t().loadFail(error.message);
    $("#selectedText").textContent = t().retry;
    console.error(error);
  }
}

state.theme = localStorage.getItem("scripture-atlas-theme") === "light" ? "light" : "dark";
document.documentElement.dataset.theme = state.theme;
$("#langSeg").addEventListener("click", (event) => { const button = event.target.closest("button"); if (button && button.dataset.lang !== state.lang) setLang(button.dataset.lang); });
applyStatic();
load();
