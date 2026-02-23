const DB_NAME = "propertease_calendar_db";
const DB_VERSION = 1;

const STORE_MONTHS = "months";
const STORE_META = "meta";

const NS_OLD = "propertease.calendar.v1"; // old localStorage namespace

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE_MONTHS)) {
        db.createObjectStore(STORE_MONTHS, { keyPath: "yyyymm" });
      }

      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("IndexedDB tx error"));
    tx.onabort = () => reject(tx.error || new Error("IndexedDB tx abort"));
  });
}

async function get(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function put(db, storeName, value) {
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(value);
  await txDone(tx);
}

async function hasMigrated(db) {
  const row = await get(db, STORE_META, "migratedFromLocalStorage");
  return Boolean(row?.value);
}

async function setMigrated(db) {
  await put(db, STORE_META, { key: "migratedFromLocalStorage", value: true, at: Date.now() });
}

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

async function migrateLocalStorageToIDB(db) {
  if (await hasMigrated(db)) return;

  const monthsToImport = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith(`${NS_OLD}.month.`)) {
      const yyyymm = k.replace(`${NS_OLD}.month.`, "");
      const raw = localStorage.getItem(k);
      const parsed = safeParse(raw) || {};
      monthsToImport.push({ yyyymm, data: parsed, updatedAt: Date.now() });
    }
  }

  for (const item of monthsToImport) {
    await put(db, STORE_MONTHS, item);
  }

  const last = localStorage.getItem(`${NS_OLD}.lastMonth`);
  if (last) {
    await put(db, STORE_META, { key: "lastMonth", value: last, at: Date.now() });
  }

  await setMigrated(db);
}

export async function initDB() {
  const db = await openDB();
  await migrateLocalStorageToIDB(db);
  return db;
}

export async function loadMonth(db, yyyymm) {
  const row = await get(db, STORE_MONTHS, yyyymm);
  return row?.data || {};
}

export async function saveMonth(db, yyyymm, data) {
  await put(db, STORE_MONTHS, {
    yyyymm,
    data: data || {},
    updatedAt: Date.now()
  });
  await put(db, STORE_META, { key: "lastMonth", value: yyyymm, at: Date.now() });
}

export async function lastMonthOrNow(db) {
  const row = await get(db, STORE_META, "lastMonth");
  if (row?.value) return row.value;

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
