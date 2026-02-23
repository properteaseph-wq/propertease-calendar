import { fmtMonthLabel, yyyymm, buildMonthGrid } from "./ui.js";
import { initDB, loadMonth, saveMonth, lastMonthOrNow } from "./db.js";
import { generateNanoPrompt, thumbs } from "./prompt-engine.js";

const el = (id) => document.getElementById(id);

// Elements
const gridEl = el("grid");
const monthLabelEl = el("monthLabel");
const monthPickerEl = el("monthPicker");

const prevBtn = el("prevBtn");
const nextBtn = el("nextBtn");
const todayBtn = el("todayBtn");
const auto2Btn = el("auto2Btn");
const saveBtn = el("saveBtn");
const savePill = el("savePill");

const categoryList = el("categoryList");
const toggleProject = el("toggleProject");
const stylePack = el("stylePack");

const selectedMeta = el("selectedMeta");
const idea = el("idea");
const promptOut = el("promptOut");
const genBtn = el("genBtn");
const copyBtn = el("copyBtn");
const status = el("status");

const sheet = el("sheet");
const sheetTitle = el("sheetTitle");
const ideaMobile = el("ideaMobile");
const promptOutMobile = el("promptOutMobile");
const genBtnMobile = el("genBtnMobile");
const saveBtnMobile = el("saveBtnMobile");
const closeSheet = el("closeSheet");

// Categories
const CATEGORIES = [
  "Buyer Tips",
  "Loan and Financing",
  "Market Insight",
  "Scams to Avoid",
  "Condo Living",
  "OFW Guide",
  "Investing Basics",
  "FAQs"
];

// Fixed weekly schedule (0=Sun..6=Sat)
const WEEK_PATTERN = {
  0: "Condo Living",
  1: "Buyer Tips",
  2: "Loan and Financing",
  3: "Market Insight",
  4: "Scams to Avoid",
  5: "Investing Basics",
  6: "OFW Guide"
};

// Topic templates per category (education-first)
const TOPICS = {
  "Buyer Tips": [
    "How smart buyers compare options (not emotions)",
    "Questions to ask before reserving a unit",
    "What to check in a location in 5 minutes",
    "The one number buyers forget to compute"
  ],
  "Loan and Financing": [
    "Downpayment vs monthly equity explained simply",
    "Bank vs Pag-IBIG: which one fits you",
    "How interest rates affect your total cost",
    "Documents you should prepare early"
  ],
  "Market Insight": [
    "Why prices increase even before turnover",
    "Pre-selling vs RFO timing: what wins",
    "What drives demand in a city",
    "How to spot a growth area"
  ],
  "Scams to Avoid": [
    "Red flags in real estate deals",
    "Common buyer traps and how to avoid them",
    "How to verify legitimacy fast",
    "Why rushing without checks is expensive"
  ],
  "Condo Living": [
    "Condo fees explained: what you pay for",
    "Rules that affect Airbnb and short stays",
    "Parking reality: why it sells out fast",
    "How to choose the best floor/view"
  ],
  "OFW Guide": [
    "How OFWs can buy with less stress",
    "How to decide without flying home",
    "What to ask your broker to send you",
    "Budgeting for equity while abroad"
  ],
  "Investing Basics": [
    "End-use vs investment: choose correctly",
    "Simple rental math beginners can use",
    "Why location beats unit size sometimes",
    "When to exit or upgrade your property"
  ],
  "FAQs": [
    "What is pre-selling and how it works",
    "Reservation fee: what it means",
    "Can you rent it out legally",
    "What happens after turnover"
  ]
};

const THUMBS = thumbs();

// State
let db;
let state = {
  month: "1970-01",
  monthData: {},
  selectedDayKey: null,
  selectedCategory: "Buyer Tips"
};

// UI helpers
function setStatus(msg) {
  if (!status) return;
  status.textContent = msg;
  clearTimeout(setStatus._t);
  setStatus._t = setTimeout(() => (status.textContent = ""), 1500);
}

function setSavePill(mode, text) {
  if (!savePill) return;

  savePill.classList.remove("saving", "saved");

  if (!savePill.dataset.dotReady) {
    const dot = document.createElement("span");
    dot.className = "saveDot";
    savePill.prepend(dot);

    const t = document.createElement("span");
    t.textContent = text || "";
    savePill.appendChild(t);

    savePill.dataset.dotReady = "1";
    return;
  }

  if (mode) savePill.classList.add(mode);
  // dot is first child, text span is second
  if (savePill.children[1]) savePill.children[1].textContent = text;
  else savePill.textContent = text;
}

function showSavedMoment() {
  setSavePill("saved", "Saved locally");
  clearTimeout(showSavedMoment._t);
  showSavedMoment._t = setTimeout(() => {
    setSavePill("", navigator.onLine ? "Online" : "Offline");
  }, 1400);
}

// Mobile sheet
function openSheet() {
  if (!sheet) return;
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
}

function closeSheetFn() {
  if (!sheet) return;
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
}

// Month helpers
function monthParts(yyyymmStr) {
  const [y, m] = yyyymmStr.split("-").map(Number);
  return { y, mIndex: m - 1 };
}

// Data
async function loadCurrentMonth() {
  state.monthData = await loadMonth(db, state.month);
}

async function saveCurrentMonth() {
  setSavePill("saving", "Saving…");
  await saveMonth(db, state.month, state.monthData);
  showSavedMoment();
}

function getDayObj(dayKey) {
  if (!state.monthData[dayKey]) {
    state.monthData[dayKey] = {
      idea: "",
      prompt: "",
      category: state.selectedCategory,
      status: "draft",
      title: "",
      thumb: ""
    };
  }
  return state.monthData[dayKey];
}

// Render
function renderHeader() {
  const { y, mIndex } = monthParts(state.month);
  monthLabelEl.textContent = fmtMonthLabel(y, mIndex);
  monthPickerEl.value = state.month;
}

function renderCategories() {
  categoryList.innerHTML = "";
  for (const c of CATEGORIES) {
    const b = document.createElement("button");
    b.className = "chip" + (c === state.selectedCategory ? " on" : "");
    b.textContent = c;
    b.onclick = () => {
      state.selectedCategory = c;
      renderCategories();

      const day = state.selectedDayKey ? state.monthData[state.selectedDayKey] : null;
      if (day) day.category = c;

      renderGrid();
    };
    categoryList.appendChild(b);
  }
}

function firstLine(text) {
  const t = (text || "").trim();
  if (!t) return "";
  return t.split(/\n|\r/)[0].slice(0, 42);
}

function renderGrid() {
  const { y, mIndex } = monthParts(state.month);
  const cells = buildMonthGrid(y, mIndex);

  const t = new Date();
  const todayKey = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;

  gridEl.innerHTML = "";

  for (const c of cells) {
    const cell = document.createElement("div");
    cell.className =
      "cell" +
      (c.dim ? " dim" : "") +
      (c.key === todayKey ? " today" : "") +
      (c.key === state.selectedDayKey ? " selected" : "");

    const topWrap = document.createElement("div");
    topWrap.className = "cellTop";

    const dateNum = document.createElement("div");
    dateNum.className = "dateNum";
    dateNum.textContent = c.d;

    const thumbBox = document.createElement("div");
    thumbBox.className = "cellThumb";

    const dayObj = state.monthData[c.key];
    const thumbSrc = dayObj?.thumb || (dayObj?.category ? THUMBS[dayObj.category] : "");
    if (thumbSrc) {
      const img = document.createElement("img");
      img.src = thumbSrc;
      img.alt = "";
      thumbBox.appendChild(img);
    }

    topWrap.appendChild(dateNum);
    topWrap.appendChild(thumbBox);

    const badge = document.createElement("div");
    badge.className = "badge";
    if (dayObj?.status) badge.classList.add(dayObj.status);
    badge.textContent = dayObj?.category ? dayObj.category : "";

    const title = document.createElement("div");
    title.className = "cellTitle";
    title.textContent = (dayObj?.title || firstLine(dayObj?.idea || "")) || "";

    cell.appendChild(topWrap);
    if (badge.textContent) cell.appendChild(badge);
    if (title.textContent) cell.appendChild(title);

    cell.onclick = () => selectDay(c.key, true);

    gridEl.appendChild(cell);
  }
}

function renderAll() {
  renderHeader();
  renderCategories();
  renderGrid();

  selectedMeta.textContent = "Select a date";
  idea.value = "";
  promptOut.value = "";
}

// Selection + editor
function selectDay(dayKey, maybeOpenMobile) {
  state.selectedDayKey = dayKey;
  const d = getDayObj(dayKey);

  selectedMeta.textContent = `${dayKey} · ${d.category || state.selectedCategory}`;
  idea.value = d.idea || "";
  promptOut.value = d.prompt || "";

  if (window.matchMedia("(max-width: 1020px)").matches && maybeOpenMobile) {
    sheetTitle.textContent = dayKey;
    ideaMobile.value = d.idea || "";
    promptOutMobile.value = d.prompt || "";
    openSheet();
  }

  renderGrid();
}

function syncEditorToData() {
  if (!state.selectedDayKey) return;
  const d = getDayObj(state.selectedDayKey);
  d.idea = idea.value;
  d.prompt = promptOut.value;
  d.category = state.selectedCategory;
  d.title = d.title || firstLine(d.idea);
  d.thumb = d.thumb || (d.category ? THUMBS[d.category] : "");
}

function generateForSelected(useMobile) {
  if (!state.selectedDayKey) {
    setStatus("Select a date first");
    return;
  }

  const d = getDayObj(state.selectedDayKey);
  const ideaText = useMobile ? ideaMobile.value : idea.value;

  d.idea = ideaText;
  d.title = d.title || firstLine(ideaText);
  d.thumb = d.thumb || (d.category ? THUMBS[d.category] : "");

  const out = generateNanoPrompt({
    idea: ideaText,
    category: d.category || state.selectedCategory,
    stylePack: stylePack.value,
    allowProject: toggleProject.checked
  });

  d.prompt = out;

  promptOut.value = out;
  if (useMobile) promptOutMobile.value = out;

  setStatus("Generated ✨");
  renderGrid();
}

// Auto schedule
function monthKeyFrom(y, mIndex) {
  return `${y}-${String(mIndex + 1).padStart(2, "0")}`;
}

function daysInMonth(y, mIndex) {
  return new Date(y, mIndex + 1, 0).getDate();
}

function pickTopic(category, day) {
  const arr = TOPICS[category] || TOPICS["Buyer Tips"];
  return arr[(day - 1) % arr.length];
}

function buildIdea(category, dateObj) {
  const topic = pickTopic(category, dateObj.getDate());
  // Keep it education-first, authority tone
  return `Topic: ${topic}\n\nKey points:\n- Define the mistake or decision\n- Explain why it matters\n- Give 2 practical tips\n- End with 1 takeaway line`;
}

async function autoScheduleTwoMonths() {
  const ok = confirm("Auto Schedule will fill CURRENT month + NEXT month.\n\nOK = Fill empty days only\nCancel = Stop");
  if (!ok) return;

  // Ask overwrite?
  const overwrite = confirm("Overwrite existing days too?\n\nOK = Overwrite\nCancel = Only fill empty days");
  const { y, mIndex } = monthParts(state.month);
  const targets = [
    { y, mIndex },
    { y: new Date(y, mIndex + 1, 1).getFullYear(), mIndex: new Date(y, mIndex + 1, 1).getMonth() }
  ];

  for (const t of targets) {
    const mKey = monthKeyFrom(t.y, t.mIndex);
    const data = await loadMonth(db, mKey);
    const total = daysInMonth(t.y, t.mIndex);

    for (let d = 1; d <= total; d++) {
      const dateObj = new Date(t.y, t.mIndex, d);
      const dow = dateObj.getDay();
      const category = WEEK_PATTERN[dow] || "Buyer Tips";
      const key = `${t.y}-${String(t.mIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const existing = data[key];
      const isEmpty = !existing || (!existing.idea && !existing.title && !existing.category);

      if (!overwrite && !isEmpty) continue;

      const ideaText = buildIdea(category, dateObj);
      const title = pickTopic(category, d);
      const thumb = THUMBS[category] || "";

      data[key] = {
        ...existing,
        category,
        title,
        thumb,
        idea: ideaText,
        status: existing?.status || "draft",
        prompt: generateNanoPrompt({
          idea: ideaText,
          category,
          stylePack: stylePack.value,
          allowProject: toggleProject.checked
        })
      };
    }

    await saveMonth(db, mKey, data);
  }

  // Reload current month view
  await loadCurrentMonth();
  renderAll();
  setStatus("Auto scheduled ✅");
}

// Navigation
async function shiftMonth(delta) {
  syncEditorToData();
  await saveCurrentMonth();

  const { y, mIndex } = monthParts(state.month);
  const d = new Date(y, mIndex + delta, 1);
  state.month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  await loadCurrentMonth();
  state.selectedDayKey = null;
  renderAll();
}

function setupNav() {
  prevBtn.onclick = async () => await shiftMonth(-1);
  nextBtn.onclick = async () => await shiftMonth(1);

  todayBtn.onclick = async () => {
    const now = new Date();
    const mm = yyyymm(now);

    if (mm !== state.month) {
      syncEditorToData();
      await saveCurrentMonth();
      state.month = mm;
      await loadCurrentMonth();
      renderAll();
    }

    const k = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    selectDay(k, false);
  };

  monthPickerEl.onchange = async () => {
    syncEditorToData();
    await saveCurrentMonth();
    state.month = monthPickerEl.value;
    await loadCurrentMonth();
    state.selectedDayKey = null;
    renderAll();
    setStatus("Loaded");
  };

  auto2Btn.onclick = async () => {
    await autoScheduleTwoMonths();
  };

  saveBtn.onclick = async () => {
    syncEditorToData();
    await saveCurrentMonth();
    setStatus("Saved ✅");
  };
}

// Buttons
genBtn.onclick = () => generateForSelected(false);

copyBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(promptOut.value || "");
    setStatus("Copied");
  } catch {
    setStatus("Copy blocked");
  }
};

idea.addEventListener("input", () => {
  if (!state.selectedDayKey) return;
  const d = getDayObj(state.selectedDayKey);
  d.idea = idea.value;
  d.title = d.title || firstLine(d.idea);
});

genBtnMobile.onclick = () => generateForSelected(true);

saveBtnMobile.onclick = async () => {
  if (!state.selectedDayKey) return;
  const d = getDayObj(state.selectedDayKey);
  d.idea = ideaMobile.value;
  d.prompt = promptOutMobile.value;
  d.title = d.title || firstLine(d.idea);
  d.thumb = d.thumb || (d.category ? THUMBS[d.category] : "");
  await saveCurrentMonth();
  setStatus("Saved ✅");
};

closeSheet.onclick = closeSheetFn;

// Service worker
function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

// Boot
async function boot() {
  db = await initDB();

  state.month = await lastMonthOrNow(db);
  await loadCurrentMonth();

  setupNav();
  renderAll();
  registerSW();

  setSavePill("", navigator.onLine ? "Online" : "Offline");
  window.addEventListener("online", () => setSavePill("", "Online"));
  window.addEventListener("offline", () => setSavePill("", "Offline"));
}

boot();
