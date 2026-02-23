const NS = "propertease.calendar.v1";

function kMonth(yyyymm) {
  return `${NS}.month.${yyyymm}`;
}

export function loadMonth(yyyymm) {
  try {
    return JSON.parse(localStorage.getItem(kMonth(yyyymm)) || "{}");
  } catch {
    return {};
  }
}

export function saveMonth(yyyymm, data) {
  localStorage.setItem(kMonth(yyyymm), JSON.stringify(data || {}));
  localStorage.setItem(`${NS}.lastMonth`, yyyymm);
}

export function lastMonthOrNow() {
  const last = localStorage.getItem(`${NS}.lastMonth`);
  if (last) return last;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
