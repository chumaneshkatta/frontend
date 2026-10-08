// All styling lives here so the src folder contains only .jsx files.
const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Bricolage+Grotesque:wght@400;500;700&display=swap');
*{box-sizing:border-box}
body{margin:0}
button,input,select,textarea{font:inherit;color:inherit}
:focus-visible{outline:3px solid #f5b21b;outline-offset:2px}
.err{color:#b3261e;min-height:1.4em;margin:8px 0 0}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#1c2733;color:#fff;padding:9px 16px;border-radius:6px;z-index:10}
label{display:block;font-weight:500;margin:12px 0 4px}
select,input[type=text],input[type=email],input[type=password],input[type=date],input[type=search],textarea{width:100%;padding:8px 10px;border:1px solid #d3dcf0;border-radius:8px;background:#fff}
dialog{border:1px solid #d9dee4;border-radius:12px;padding:22px;width:min(440px,92vw)}
dialog::backdrop{background:rgba(28,39,51,.45)}
dialog h3{margin:0 0 4px}
.row{display:flex;gap:8px;justify-content:flex-end;margin-top:18px}
.btn{border:1px solid #d9dee4;background:#fff;padding:6px 12px;border-radius:6px;cursor:pointer}
.btn:disabled{opacity:.5;cursor:default}
.btn.primary{background:#0e6b5c;border-color:#0e6b5c;color:#fff}
.btn.danger{color:#b3261e}
.btn.sm{padding:3px 9px;font-size:13px}
.login-wrap{min-height:100vh;display:grid;place-items:center;background:#eaf1fb;font-family:'Bricolage Grotesque',system-ui,sans-serif;color:#22244f}
.login{width:min(400px,92vw);padding:32px;background:#fff;border-radius:20px}
.login h1{font-size:30px;line-height:1.1;margin:0 0 6px}
.login p{margin:0;color:#5b5e86}
.login .btn.primary{width:100%;background:#3b3fd8;border-color:#3b3fd8;border-radius:999px;padding:10px;margin-top:8px}
.login .switch{margin-top:14px;text-align:center;color:#5b5e86}
.link{background:none;border:0;color:#3b3fd8;cursor:pointer;text-decoration:underline;padding:0}
.login details{margin-top:14px;color:#5b5e86;font-size:14px}

.admin{min-height:100vh;background:#f3f5f7;color:#1c2733;font:15px/1.5 'IBM Plex Sans',system-ui,sans-serif}
.admin header{display:flex;align-items:center;gap:12px;padding:12px 24px;background:#1c2733;color:#fff}
.admin header h1{font-size:17px;margin:0;flex:1}
.admin header span{color:#b9c4cf;font-size:14px}
.admin header .btn{background:transparent;color:#fff;border-color:#4a5b6c}
.layout{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:20px;padding:20px 24px;align-items:start}
@media(max-width:900px){.layout{grid-template-columns:1fr}}
.panel{background:#fff;border:1px solid #d9dee4;border-radius:10px;padding:16px}
.panel h2{font-size:16px;margin:0}
.bar{display:flex;gap:8px;align-items:center;margin-bottom:12px}
.bar h2{flex:1}
.bar input{max-width:210px}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:9px 8px;border-bottom:1px solid #d9dee4;vertical-align:middle}
th{font-weight:600;color:#5d6b79;font-size:13px}
tr.sel td{background:#e8f3f0}
td small{color:#5d6b79;display:block}
.acts{display:flex;gap:6px;white-space:nowrap}
progress{width:90px;height:8px;accent-color:#0e6b5c}
.pager{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-top:12px;color:#5d6b79}
.tasks{list-style:none;margin:0;padding:0}
.tasks li{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #d9dee4}
.tasks li.done .t{text-decoration:line-through;color:#5d6b79}
.tasks .t{font-weight:500}
.tasks .d{color:#5d6b79;font-size:13px}
.tasks .body{flex:1}
.tasks input[type=checkbox]{width:18px;height:18px;margin-top:3px}
.empty{color:#5d6b79;padding:16px 0}
code{background:#eef1f4;padding:2px 6px;border-radius:4px;user-select:all}

.portal{min-height:100vh;background:#eaf1fb;color:#22244f;font:16px/1.55 'Bricolage Grotesque',system-ui,sans-serif}
.portal header{display:flex;align-items:center;gap:12px;padding:22px 28px 6px}
.portal header h1{font-size:28px;line-height:1.15;margin:0;flex:1}
.portal .btn{border-radius:999px;border-color:#d3dcf0}
.portal .btn.primary{background:#3b3fd8;border-color:#3b3fd8}
.portal main{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;padding:16px 28px 32px}
@media(max-width:860px){.portal main{grid-template-columns:1fr}}
.card{background:#fff;border-radius:20px;padding:22px}
.card h2{font-size:20px;margin:0 0 4px}
.sub{color:#5b5e86;margin:0 0 14px}
.meter{height:10px;background:#e6eaf7;border-radius:99px;overflow:hidden;margin:6px 0 18px}
.meter>i{display:block;height:100%;background:#1d7a52;transition:width .3s}
.checklist{list-style:none;margin:0;padding:0}
.checklist li{display:flex;gap:12px;padding:12px 0;border-top:1px solid #d3dcf0}
.checklist input{width:22px;height:22px;margin-top:3px;accent-color:#1d7a52}
.checklist label{margin:0;cursor:pointer}
.checklist li.done label{text-decoration:line-through;color:#5b5e86}
.checklist small{display:block;color:#5b5e86;font-weight:400}
.chat{display:flex;flex-direction:column;height:min(560px,70vh)}
.log{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:4px 2px 12px}
.msg{max-width:88%;padding:10px 14px;border-radius:16px}
.msg.me{align-self:flex-end;background:#3b3fd8;color:#fff;border-bottom-right-radius:4px}
.msg.bot{align-self:flex-start;background:#eef1fb;border-bottom-left-radius:4px}
.msg small{display:block;margin-top:6px;color:#5b5e86}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.chip{border:1px solid #d3dcf0;background:#fff;border-radius:99px;padding:5px 12px;cursor:pointer;font-size:14px}
.ask{display:flex;gap:8px}
`

export default function Styles() {
  return <style>{css}</style>
}
