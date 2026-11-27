#!/usr/bin/env node
"use strict";

/* Throwaway tool: compare light-theme colour options on the real pages.
   Serves the site like dev/tools/serve.js and injects a small bar at the bottom of
   every page. The bar swaps the light theme's background and accent colour variables
   live (chosen separately, with contrast figures) and switches between the dark and the light theme, so a colour (and later the
   logo) can be judged on both backgrounds. It changes no site file.
       node dev/previews/preview-light.js      then open http://localhost:8128
   Uses only Node built-ins (no npm). Restart it after editing this file. */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = path.resolve(__dirname, "..", "..");
const PORT = process.env.PORT || 8128;

const MIME = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8", ".json": "application/json; charset=utf-8"
};

/* The options. Only the light theme's variables are overridden; the dark theme
   is never touched. Background and accent are chosen separately. */
/* A background is four surface colours; the shadow and an optional warmer text
   colour ride along. */
function bg(bgc, surface, surface2, border, extra) {
    const v = { "--bg": bgc, "--surface": surface, "--surface-2": surface2, "--border": border,
        "--shadow": "0 4px 20px rgba(20, 30, 40, 0.11)" };
    for (const k in (extra || {})) v[k] = extra[k];
    return v;
}
const BACKGROUNDS = [
    { id: "a", name: "Current", vars: {} },
    { id: "b", name: "Softer grey", vars: bg("#e8ebef", "#f4f6f8", "#dde2e8", "#c6cdd6") },
    { id: "c", name: "Cool blue-grey", vars: bg("#e3e9f1", "#f2f5fa", "#d6dfeb", "#bfcbdb") },
    { id: "d", name: "Slate (deeper)", vars: bg("#d9dee5", "#eceff3", "#cbd2db", "#b3bcc8") },
    { id: "e", name: "Warm paper", vars: bg("#f2efe8", "#fbfaf6", "#e9e5db", "#d6d0c2",
        { "--text": "#22211d", "--muted": "#5f5b50" }) },
    { id: "f", name: "Soft teal tint", vars: bg("#e9f1f0", "#f6faf9", "#dbe8e6", "#c3d5d2") },
    { id: "g", name: "Sage", vars: bg("#e5ebe3", "#f3f6f1", "#d7e0d4", "#bfcbbb") },
    { id: "h", name: "Stone", vars: bg("#ebe9e5", "#f7f6f3", "#dedbd5", "#c9c5bd") },
    { id: "i", name: "Lavender mist", vars: bg("#e9e8f1", "#f5f4fa", "#dddbe9", "#c8c5da") },
    { id: "j", name: "Mist white", vars: bg("#eef1f4", "#fafbfc", "#e2e6ea", "#cfd5db") },
    { id: "k", name: "Sand", vars: bg("#efe9dd", "#faf7f0", "#e4dccb", "#d0c6b0",
        { "--text": "#26221a", "--muted": "#625b4a" }) },
    { id: "l", name: "Paper deeper", vars: bg("#ebe7de", "#f8f6f1", "#e0dbd0", "#cdc7ba",
        { "--text": "#22211d", "--muted": "#5f5b50" }) },
    { id: "m", name: "Paper deep", vars: bg("#e6e1d7", "#f5f2ec", "#dad4c8", "#c6bfb0",
        { "--text": "#22211d", "--muted": "#5c584d" }) }
];

/* accent = buttons, highlights, decoration; link = link text and small accents,
   darker so it stays readable. */
function acc(accent, link, hover) {
    return { "--accent": accent, "--accent-strong": link, "--link": link, "--hover": hover };
}
const ACCENTS = [
    { id: "1", name: "Current teal", vars: {} },
    { id: "2", name: "Vivid teal", vars: acc("#0d9488", "#0f766e", "#115e59") },
    { id: "3", name: "Emerald", vars: acc("#059669", "#047857", "#065f46") },
    { id: "4", name: "Deep forest", vars: acc("#0b5f58", "#0b5f58", "#084a45") },
    { id: "5", name: "Jade", vars: acc("#0a9a73", "#0a7a5c", "#075f47") },
    { id: "6", name: "Spruce", vars: acc("#1b7f6b", "#176b5a", "#10513f") },
    { id: "7", name: "Pine", vars: acc("#134e4a", "#134e4a", "#0b3633") },
    { id: "19", name: "Pine bright", vars: acc("#17665f", "#135a54", "#0e4640") },
    { id: "20", name: "Pine soft", vars: acc("#1f6b63", "#185a53", "#124540") },
    { id: "21", name: "Pine blue", vars: acc("#155e6b", "#134e5a", "#0e3d47") },
    { id: "22", name: "Pine green", vars: acc("#166534", "#14532d", "#0f3d21") },
    { id: "8", name: "Mint", vars: acc("#14b8a6", "#0f766e", "#115e59") },
    { id: "9", name: "Lime", vars: acc("#65a30d", "#4d7c0f", "#3f6212") },
    { id: "10", name: "Cyan", vars: acc("#0891b2", "#0e7490", "#155e75") },
    { id: "11", name: "Blue", vars: acc("#2563eb", "#1d4ed8", "#1e40af") },
    { id: "12", name: "Indigo", vars: acc("#4f46e5", "#4338ca", "#3730a3") },
    { id: "13", name: "Violet", vars: acc("#7c3aed", "#6d28d9", "#5b21b6") },
    { id: "14", name: "Magenta", vars: acc("#c026d3", "#a21caf", "#86198f") },
    { id: "15", name: "Coral", vars: acc("#e11d48", "#be123c", "#9f1239") },
    { id: "16", name: "Orange", vars: acc("#ea580c", "#c2410c", "#9a3412") },
    { id: "17", name: "Amber", vars: acc("#d97706", "#b45309", "#92400e") },
    { id: "18", name: "Slate ink", vars: acc("#334155", "#1e293b", "#0f172a") }
];

/* One-click shortlist: [label, background id, accent id]. */
const PRESETS = [
    ["Warm paper + Pine", "e", "7"],
    ["Paper deeper + Pine", "l", "7"],
    ["Paper deep + Pine", "m", "7"],
    ["Paper deeper + Pine bright", "l", "19"],
    ["Sand + Pine", "k", "7"],
    ["Warm paper + Pine bright", "e", "19"],
    ["Sand + Pine bright", "k", "19"],
    ["Warm paper + Pine soft", "e", "20"],
    ["Sage + Pine", "g", "7"],
    ["Soft teal tint + Slate ink", "f", "18"],
    ["Sage + Slate ink", "g", "18"]
];

const PAGES = [["Home", "/"], ["Projects", "/projects"], ["Achievements", "/achievements"],
    ["Skills", "/skills"], ["Experience", "/experience"], ["Recommendations", "/recommendations"]];

function bar() {
    const data = JSON.stringify({ bg: BACKGROUNDS, ac: ACCENTS, pr: PRESETS });
    const pages = PAGES.map(function (p) {
        return '<a href="' + p[1] + '">' + p[0] + "</a>";
    }).join("");
    return '<div id="lp-bar" style="position:fixed;left:0;right:0;bottom:0;z-index:2147483647;' +
        'background:#111418;color:#e6e8eb;font:13px/1.3 system-ui,Segoe UI,Arial,sans-serif;' +
        'border-top:1px solid #333a45;padding:8px 10px;display:flex;flex-direction:column;gap:6px;' +
        'box-shadow:0 -4px 16px rgba(0,0,0,.35)">' +
        '<div class="lp-row"><strong>Shortlist</strong><span id="lp-pr" class="lp-group"></span></div>' +
        '<div class="lp-row"><strong>Background</strong><span id="lp-bg" class="lp-group"></span>' +
        '<button type="button" id="lp-theme" class="lp-btn">Theme: </button>' +
        '<button type="button" id="lp-shuffle" class="lp-btn">Shuffle (S)</button></div>' +
        '<div class="lp-row"><strong>Accent</strong><span id="lp-ac" class="lp-group"></span></div>' +
        '<div class="lp-row"><span id="lp-read" style="color:#9aa3ad"></span>' +
        '<span id="lp-pages" style="margin-left:auto;display:flex;flex-wrap:wrap;gap:8px">' + pages + "</span></div></div>" +
        "<style>#lp-bar strong{color:#2dd4a7;min-width:78px}.lp-row{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center}" +
        ".lp-group{display:flex;flex-wrap:wrap;gap:4px}.lp-btn,.lp-group button{cursor:pointer;border:1px solid #444c59;" +
        "background:#1d212a;color:#e6e8eb;border-radius:6px;padding:4px 8px;font:inherit}" +
        ".lp-group button.on{background:#2dd4a7;color:#08120f;border-color:#2dd4a7}" +
        ".lp-sw{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px;border:1px solid rgba(255,255,255,.4)}" +
        "#lp-pages a{color:#9aa3ad;text-decoration:none}#lp-pages a:hover{color:#fff}body{padding-bottom:250px!important}</style>" +
        "<script>(function(){var D=" + data + ";" +
        "var st=document.createElement('style');st.id='lp-override';document.head.appendChild(st);" +
        "function get(k,d){try{return window.localStorage.getItem(k)||d}catch(e){return d}}" +
        "function set(k,v){try{window.localStorage.setItem(k,v)}catch(e){}}" +
        "var S={bg:get('lp-bg','b'),ac:get('lp-ac','2')};" +
        "function find(list,id){for(var i=0;i<list.length;i++){if(list[i].id===id)return list[i]}return list[0]}" +
        "var vals={bg:'#f7f8fa',link:'#0e7a70',accent:'#0e7a70'};" +
        "function lum(h){var r=parseInt(h.substr(1,2),16)/255,g=parseInt(h.substr(3,2),16)/255,b=parseInt(h.substr(5,2),16)/255;" +
        "function f(c){return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)}return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)}" +
        "function ratio(a,b){var x=lum(a),y=lum(b);return ((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(1)}" +
        "function apply(){var b=find(D.bg,S.bg),a=find(D.ac,S.ac),css='',m={},k;" +
        "for(k in b.vars){m[k]=b.vars[k]}for(k in a.vars){m[k]=a.vars[k]}" +
        "var acc0=m['--accent']||'#0e7a70';if(ratio('#ffffff',acc0)<3){m['--accent-contrast']='#0b1411'}" +
        "for(k in m){css+=k+':'+m[k]+';'}" +
        "st.textContent=css?'html[data-theme=\"light\"],html[data-theme=\"light\"] body{'+css+'}':'';" +
        "set('lp-bg',b.id);set('lp-ac',a.id);" +
        "var bg=m['--bg']||'#f7f8fa',lk=m['--link']||'#0e7a70',ac=m['--accent']||'#0e7a70';" +
        "document.getElementById('lp-read').innerHTML='Link text on page: <b>'+ratio(lk,bg)+':1</b> (4.5 needed) &nbsp;·&nbsp; button text on accent: <b>'+(ratio('#ffffff',ac)<3?'dark '+ratio('#0b1411',ac):'white '+ratio('#ffffff',ac))+':1</b> (3 needed for large text; dark text is used when white is under 3)';" +
        "mark('lp-bg',b.id);mark('lp-ac',a.id)}" +
        "function mark(id,val){var bs=document.getElementById(id).children;for(var i=0;i<bs.length;i++){bs[i].className=bs[i].getAttribute('data-id')===val?'on':''}}" +
        "function build(id,list,key){var box=document.getElementById(id);list.forEach(function(o){var b=document.createElement('button');" +
        "b.type='button';b.setAttribute('data-id',o.id);var sw=o.vars['--accent']||o.vars['--bg'];" +
        "if(key==='ac'){sw=o.vars['--accent']||'#0e7a70'}else{sw=o.vars['--bg']||'#f7f8fa'}" +
        "b.innerHTML='<span class=\"lp-sw\" style=\"background:'+sw+'\"></span>'+o.name;" +
        "b.onclick=function(){S[key]=o.id;apply()};box.appendChild(b)})}" +
        "var themeBtn=document.getElementById('lp-theme');" +
        "function theme(t){document.documentElement.setAttribute('data-theme',t);set('lp-theme',t);themeBtn.textContent='Theme: '+t}" +
        "build('lp-bg',D.bg,'bg');build('lp-ac',D.ac,'ac');" +
        "D.pr.forEach(function(p){var b=document.createElement('button');b.type='button';b.textContent=p[0];b.onclick=function(){S.bg=p[1];S.ac=p[2];apply()};document.getElementById('lp-pr').appendChild(b)});" +
        "function shuffle(){S.bg=D.bg[Math.floor(Math.random()*D.bg.length)].id;S.ac=D.ac[Math.floor(Math.random()*D.ac.length)].id;apply()}" +
        "document.getElementById('lp-shuffle').onclick=shuffle;" +
        "themeBtn.onclick=function(){theme(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light')};" +
        "document.addEventListener('keydown',function(e){if(e.target&&/input|textarea|select/i.test(e.target.tagName))return;" +
        "if(e.key==='t'||e.key==='T'){themeBtn.onclick()}else if(e.key==='s'||e.key==='S'){shuffle()}});" +
        "apply();theme(get('lp-theme','light'))})();</script>";
}

function isFile(p) {
    try { return fs.statSync(p).isFile(); } catch (e) { return false; }
}

function resolve(pathname) {
    let decoded;
    try { decoded = decodeURIComponent(pathname); } catch (e) { return null; }
    if (decoded.indexOf("\0") !== -1) return null;
    const norm = path.normalize(decoded);
    if (norm === "\\" || norm === "/" || norm === ".") return path.join(ROOT, "homepage.template.html");
    if (norm === "\\recommendations" || norm === "/recommendations") return path.join(ROOT, "recommendations.template.html");
    const full = path.resolve(ROOT, "." + norm);
    if (full !== ROOT && full.indexOf(ROOT + path.sep) !== 0) return null;
    return full;
}

function send(res, file) {
    const ext = path.extname(file).toLowerCase();
    if (ext === ".html") {
        let html = fs.readFileSync(file, "utf8");
        html = html.indexOf("</body>") !== -1 ? html.replace("</body>", bar() + "</body>") : html + bar();
        res.writeHead(200, { "Content-Type": MIME[".html"], "Cache-Control": "no-store" });
        res.end(html);
        return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(res);
}

http.createServer(function (req, res) {
    let pathname = url.parse(req.url).pathname || "/";
    if (/\.html$/i.test(pathname)) {
        res.writeHead(308, { Location: pathname.replace(/\.html$/i, "") || "/" });
        res.end();
        return;
    }
    let target = resolve(pathname);
    if (target && !isFile(target) && isFile(target + ".html")) target += ".html";
    if (target && isFile(target)) { send(res, target); return; }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
}).listen(PORT, function () {
    console.log("Light colour preview: http://localhost:" + PORT);
    console.log("Pick an option in the bar at the bottom. Ctrl+C to stop.");
});
