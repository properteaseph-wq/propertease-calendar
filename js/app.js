import { fmtMonthLabel, yyyymm, buildMonthGrid } from "./ui.js";
import { initDB, loadMonth, saveMonth, lastMonthOrNow } from "./db.js";
import { generateNanoPrompt } from "./prompt-engine.js";

const el = (id) => document.getElementById(id);

const gridEl = el("grid");
const monthLabelEl = el("monthLabel");
const monthPickerEl = el("monthPicker");

const prevBtn = el("prevBtn");
const nextBtn = el("nextBtn");
const todayBtn = el("todayBtn");
const saveBtn = el("saveBtn");

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

let db;
let state = {
  month: "1970-01",
  monthData: {},
  selectedDayKey: null,
  selectedCategory: "Buyer Tips"
};

function setStatus(msg) {
  status.textContent = msg;
  clearTimeout(setStatus._t);
  setStatus._t = setTimeout(() => (status.textContent = ""), 1500);
}

function openSheet() {
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
}
function closeSheetFn() {
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
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

function monthParts(yyyymmStr) {
  const [y, m] = yyyymmStr.split("-").map(Number);
  return { y, mIndex: m - 1 };
}

async function loadCurrentMonth() {
  state.monthData = await loadMonth(db, state.month);
}

async function saveCurrentMonth() {
  await saveMonth(db, state.month, state.monthData);
}

function getDayObj(dayKey) {
  if (!state.monthData[dayKey]) {
    state.monthData[dayKey] = { idea: "", prompt: "", category: state.selectedCategory, status: "draft" };
  }
  return state.monthData[dayKey];
}

function renderHeader() {
  const { y, mIndex } = monthParts(state.month);
  monthLabelEl.textContent = fmtMonthLabel(y, mIndex);
  monthPickerEl.value = state.month;
}

function renderGrid() {
  const { y, mIndex } = monthParts(state.month);
  const cells = buildMonthGrid(y, mIndex);
  const todayKey = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
  })();

  gridEl.innerHTML = "";
  for (const c of cells) {
    const cell = document.createElement("div");
    cell.className = "cell" + (c.dim ? " dim" : "") + (c.key === todayKey ? " today" : "") + (c.key === state.selectedDayKey ? " selected" : "");
    cell.dataset.key = c.key;

    const top = document.createElement("div");
    top.className = "dateNum";
    top.textContent = c.d;

    const dayObj = state.monthData[c.key];
    const badge = document.createElement("div");
    badge.className = "badge";
    if (dayObj?.status) badge.classList.add(dayObj.status);
    badge.textContent = dayObj?.category ? dayObj.category : "";

    cell.appendChild(top);
    if (badge.textContent) cell.appendChild(badge);

    cell.onclick = () => selectDay(c.key, true);

    gridEl.appendChild(cell);
  }
}

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

function generateForSelected(useMobile) {
  if (!state.selectedDayKey) {
    setStatus("Select a date first");
    return;
  }
  const d = getDayObj(state.selectedDayKey);

  const ideaText = useMobile ? ideaMobile.value : idea.value;
  d.idea = ideaText;

  const out = generateNanoPrompt({
    idea: ideaText,
    category: d.category || state.selectedCategory,
    stylePack: stylePack.value,
    allowProject: toggleProject.checked
  });

  d.prompt = out;

  if (useMobile) promptOutMobile.value = out;
  promptOut.value = out;

  setStatus("Generated ✨");
  renderGrid();
}

function syncEditorToData() {
  if (!state.selectedDayKey) return;
  const d = getDayObj(state.selectedDayKey);
  d.idea = idea.value;
  d.prompt = promptOut.value;
  d.category = state.selectedCategory;
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
    const k = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
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

  saveBtn.onclick = async () => {
  syncEditorToData();
  await saveCurrentMonth();
  setStatus("Saved ✅");
};
}

async function shiftMonth(delta) {
  syncEditorToData();
  await saveCurrentMonth();

  const { y, mIndex } = monthParts(state.month);
  const d = new Date(y, mIndex + delta, 1);
  state.month = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  await loadCurrentMonth();
  state.selectedDayKey = null;
  renderAll();
}

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
});

genBtnMobile.onclick = () => generateForSelected(true);
saveBtnMobile.onclick = () => {
  if (!state.selectedDayKey) return;
  const d = getDayObj(state.selectedDayKey);
  d.idea = ideaMobile.value;
  d.prompt = promptOutMobile.value;
  saveCurrentMonth();
  setStatus("Saved ✅");
};
closeSheet.onclick = closeSheetFn;

function renderAll() {
  renderHeader();
  renderCategories();
  renderGrid();
  selectedMeta.textContent = "Select a date";
  idea.value = "";
  promptOut.value = "";
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

loadCurrentMonth();
setupNav();
renderAll();
registerSW();
