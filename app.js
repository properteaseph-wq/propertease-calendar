// Minimal offline PWA + per-month autosave using localStorage (starter).
// We’ll upgrade to IndexedDB later once UI + flows are final.

const monthInput = document.getElementById("month");
const notes = document.getElementById("notes");
const saveBtn = document.getElementById("saveBtn");
const copyBtn = document.getElementById("copyBtn");
const statusEl = document.getElementById("status");

function monthKey(value) {
  // value is YYYY-MM
  return `propertease.month.${value}`;
}

function setStatus(msg) {
  statusEl.textContent = msg;
  clearTimeout(setStatus._t);
  setStatus._t = setTimeout(() => (statusEl.textContent = ""), 1600);
}

function saveCurrent() {
  const key = monthKey(monthInput.value);
  localStorage.setItem(key, notes.value);
  localStorage.setItem("propertease.lastMonth", monthInput.value);
  setStatus("Saved ✅");
}

function loadMonth(value) {
  const key = monthKey(value);
  notes.value = localStorage.getItem(key) || "";
  setStatus("Loaded 📦");
}

function initMonth() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const defaultMonth = `${y}-${m}`;
  const last = localStorage.getItem("propertease.lastMonth") || defaultMonth;
  monthInput.value = last;
  loadMonth(last);
}

monthInput.addEventListener("change", () => {
  // autosave previous state first
  saveCurrent();
  loadMonth(monthInput.value);
});

saveBtn.addEventListener("click", saveCurrent);

notes.addEventListener("input", () => {
  // silent autosave
  const key = monthKey(monthInput.value);
  localStorage.setItem(key, notes.value);
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(notes.value || "");
    setStatus("Copied ✨");
  } catch {
    setStatus("Copy blocked on this browser");
  }
});

// Register Service Worker for offline caching
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initMonth();
