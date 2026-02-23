:root{
  --bg:#0b0f19; --card:#11182a; --text:#e8eefc; --muted:#a7b3d6;
  --line:rgba(255,255,255,.08); --btn:#2b66ff; --btn2:#1b2742;
  --chip:rgba(255,255,255,.06); --chipOn:rgba(43,102,255,.22);
}

*{box-sizing:border-box}
body{
  margin:0;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Arial,sans-serif;
  background:
    radial-gradient(1200px 600px at 20% 0%, rgba(43,102,255,.25), transparent 60%),
    radial-gradient(900px 500px at 80% 20%, rgba(255,80,180,.18), transparent 55%),
    var(--bg);
  color:var(--text);
}

/* Top bar */
.topbar{
  position:sticky; top:0; z-index:10;
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px; border-bottom:1px solid var(--line);
  backdrop-filter: blur(10px);
  background: rgba(11,15,25,.75);
  gap:14px;
}

.brand{display:flex; gap:12px; align-items:center}
.brandLogo{
  width:36px; height:36px; border-radius:12px;
  object-fit:cover;
  box-shadow: 0 12px 30px rgba(43,102,255,.18);
  border:1px solid rgba(255,255,255,.12);
}
.title{font-weight:900; letter-spacing:.2px}
.sub{font-size:12px; color:var(--muted); margin-top:2px}

.controls{display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:flex-end}

/* Month picker wrapper (label + hidden input) */
.monthWrap{
  position:relative;
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border:1px solid var(--line);
  border-radius:14px;
  background:rgba(255,255,255,.05)
}
.monthLabel{font-weight:900}
.monthPicker{position:absolute; inset:0; opacity:0; cursor:pointer}

.btn{
  border:1px solid rgba(255,255,255,.10);
  background: var(--btn);
  color:white;
  padding:10px 14px;
  border-radius:14px;
  font-weight:900;
  cursor:pointer;
}
.btn.secondary{background: var(--btn2)}
.btn.ghost{background: rgba(255,255,255,.05)}
.btn.full{width:100%}

/* Save pill */
.savePill{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:9px 12px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.05);
  color: var(--muted);
  font-weight:900;
  font-size:12px;
  letter-spacing:.06em;
  text-transform:uppercase;
  user-select:none;
}
.saveDot{width:8px; height:8px; border-radius:999px; background: rgba(255,255,255,.25);}
.savePill.saved{color:#cfe0ff; border-color: rgba(43,102,255,.30); background: rgba(43,102,255,.12);}
.savePill.saving{color:#ffd9f0; border-color: rgba(255,80,180,.28); background: rgba(255,80,180,.10);}

/* App shell layout */
.shell{
  max-width: 1400px;
  margin: 18px auto;
  padding: 0 14px 30px;
  display:grid;
  grid-template-columns: 280px 1fr 360px;
  gap:14px;
}

.panel{
  background: rgba(17,24,42,.82);
  border:1px solid var(--line);
  border-radius:18px;
  padding:14px;
  box-shadow: 0 18px 60px rgba(0,0,0,.35);
}

.panelTitle{font-weight:950; margin: 6px 0 10px; letter-spacing:.2px;}

.hint{color:var(--muted); font-size:12px; line-height:1.5;}

.mini{margin-top:10px; padding:10px 12px; border-radius:16px; border:1px solid var(--line); background: rgba(255,255,255,.03);}
.miniRow{display:flex; gap:10px; align-items:flex-start; color:var(--muted); font-weight:800; font-size:12px; line-height:1.4;}
.miniDot{width:8px; height:8px; border-radius:999px; background: rgba(43,102,255,.55); margin-top:4px; flex:0 0 auto;}

/* Category chips */
.chipGrid{display:flex; flex-wrap:wrap; gap:8px}
.chip{
  padding:8px 10px;
  border-radius:999px;
  border:1px solid var(--line);
  background: var(--chip);
  color: var(--text);
  font-weight:900;
  cursor:pointer;
  font-size:13px;
}
.chip.on{background: var(--chipOn); border-color: rgba(43,102,255,.35)}

.toggle{display:flex; align-items:center; gap:10px; color:var(--muted); font-weight:900; font-size:13px}
.select{
  width:100%;
  padding:10px 12px;
  border-radius:14px;
  border:1px solid var(--line);
  background: rgba(255,255,255,.05);
  color: var(--text);
  font-weight:900;
  outline:none;
}

/* Calendar */
.main{
  background: rgba(17,24,42,.72);
  border:1px solid var(--line);
  border-radius:18px;
  overflow:hidden;
}

.calendarHead{
  display:grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom:1px solid var(--line);
  background: rgba(255,255,255,.03);
}

.dow{
  padding:10px 12px;
  color: var(--muted);
  font-weight:950;
  font-size:12px;
  text-transform:uppercase;
  letter-spacing:.12em;
}

.grid{display:grid; grid-template-columns: repeat(7, 1fr)}
.cell{
  min-height: 118px;
  border-right:1px solid var(--line);
  border-bottom:1px solid var(--line);
  padding:10px 10px 12px;
  cursor:pointer;
  position:relative;
  background: rgba(255,255,255,.02);
}
.cell:nth-child(7n){border-right:none}
.cell:hover{background: rgba(43,102,255,.08)}
.cell.dim{opacity:.55}
.cell.today{outline:2px solid rgba(255,80,180,.55); outline-offset:-2px}
.cell.selected{outline:2px solid rgba(43,102,255,.70); outline-offset:-2px}

.cellTop{display:flex; align-items:flex-start; justify-content:space-between; gap:10px;}
.dateNum{font-weight:950; font-size:13px}

.cellThumb{
  width:34px; height:34px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.05);
  display:flex; align-items:center; justify-content:center;
  overflow:hidden;
  flex:0 0 auto;
}
.cellThumb img{width:100%; height:100%; object-fit:cover; display:block;}

.cellTitle{
  margin-top:8px;
  font-size:12px;
  font-weight:950;
  color: rgba(232,238,252,.88);
  line-height:1.2;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

/* Badges */
.badge{
  margin-top:8px;
  display:inline-block;
  padding:6px 8px;
  border-radius:10px;
  background: rgba(255,255,255,.06);
  border:1px solid var(--line);
  color: var(--muted);
  font-size:12px;
  font-weight:950;
}
.badge.ready{color:#cfe0ff}
.badge.posted{color:#d9ffd9}

/* Right editor */
.field{display:flex; flex-direction:column; gap:6px; margin-top:10px}
.field span{
  color:var(--muted);
  font-size:12px;
  font-weight:950;
  letter-spacing:.08em;
  text-transform:uppercase
}
textarea{
  width:100%;
  border-radius:16px;
  border:1px solid var(--line);
  background: rgba(255,255,255,.04);
  color: var(--text);
  padding: 12px;
  outline:none;
  font-size: 14px;
  line-height: 1.45;
  resize: vertical;
}
.row{display:flex; gap:10px; align-items:center; margin-top:12px}
.meta{color:var(--muted); font-weight:950; font-size:13px}
.status{color:var(--muted); font-size:13px; margin-top:10px}

/* Mobile sheet */
.sheet{
  position:fixed; left:0; right:0; bottom:-100%;
  background: rgba(17,24,42,.98);
  border-top:1px solid var(--line);
  border-top-left-radius:18px;
  border-top-right-radius:18px;
  transition: bottom .22s ease;
  padding:10px 12px 16px;
  z-index:30;
  box-shadow: 0 -20px 70px rgba(0,0,0,.55);
  display:none;
}
.sheet.open{bottom:0}
.sheetHandle{
  width:54px; height:5px;
  border-radius:999px;
  background: rgba(255,255,255,.20);
  margin: 0 auto 10px;
}
.sheetTitle{font-weight:950; margin: 0 0 8px}
.sheetBody textarea{min-height:120px}

/* Responsive */
@media (max-width: 1020px){
  .shell{grid-template-columns: 1fr}
  .side, .right{display:none}
  .cell{min-height: 98px}
  .sheet{display:block}
}
@media (max-width: 640px){
  .controls{gap:8px}
  .btn{padding:10px 12px}
}
