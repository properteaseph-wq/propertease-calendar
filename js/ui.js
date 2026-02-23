export function fmtMonthLabel(y, m) {
  const d = new Date(y, m, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function yyyymm(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function buildMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevDays = new Date(year, monthIndex, 0).getDate();

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - startDow + 1;
    let y = year, m = monthIndex, d = dayNum, dim = false;

    if (dayNum <= 0) {
      dim = true;
      d = prevDays + dayNum;
      m = monthIndex - 1;
      if (m < 0) { m = 11; y = year - 1; }
    } else if (dayNum > daysInMonth) {
      dim = true;
      d = dayNum - daysInMonth;
      m = monthIndex + 1;
      if (m > 11) { m = 0; y = year + 1; }
    }

    const key = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    cells.push({ key, y, m, d, dim });
  }
  return cells;
}
