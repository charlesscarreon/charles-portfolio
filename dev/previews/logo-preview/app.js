(function () {
  var BGS = [
    { name: "Pure black", color: "#000000", fg: "#ffffff" },
    { name: "Site dark theme", color: "#0f1115", fg: "#e6e8eb" },
    { name: "Light theme (Paper deeper)", color: "#ebe7de", fg: "#22211d" },
    { name: "Pure white", color: "#ffffff", fg: "#111111" }
  ];
  var uidN = 0;
  function uid() { uidN += 1; return "u" + uidN; }
  function n(v) { return String(Math.round(v * 100) / 100); }
  function S(c, w) { return ' fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"'; }
  function F(c) { return ' fill="' + c + '"'; }

  /* ======================= view 1: all candidates ======================= */
  var PALETTES = {
    pine:     { tile: "#17665f", glyph: "#f8f6f1", alt: "#5eead4", label: "Pine tile, cream mark" },
    teal:     { tile: "#2dd4a7", glyph: "#0b1411", alt: "#0f6b58", label: "Teal tile, dark mark" },
    dark:     { tile: "#0f1115", glyph: "#2dd4a7", alt: "#ffffff", label: "Dark tile, teal mark" },
    cream:    { tile: "#f8f6f1", glyph: "#17665f", alt: "#0b3633", label: "Cream tile, pine mark" },
    tealmark: { tile: null, glyph: "#2dd4a7", alt: "#7ee8cb", label: "Teal mark, no tile" },
    pinemark: { tile: null, glyph: "#17665f", alt: "#2f8f84", label: "Pine mark, no tile" }
  };

  /* Every logo draws on a 64 x 64 canvas. c = { tile, glyph, alt, hole }. */
  var LOGOS = [
    { name: "Monitor with C", note: "computer monitor", draw: function (c) {
      return '<rect x="11" y="14" width="42" height="29" rx="4"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M26 51h12M32 43v8"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M37.5 25A7.5 7.5 0 1 0 37.5 33"' + S(c.alt, 3.2) + '/>'; } },
    { name: "Monitor with code brackets", note: "computer monitor", draw: function (c) {
      return '<rect x="10" y="14" width="44" height="29" rx="4"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M26 51h12M32 43v8"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M26 22l-6 6.5 6 6.5M38 22l6 6.5-6 6.5"' + S(c.alt, 3.2) + '/>'; } },
    { name: "Laptop with C", note: "laptop", draw: function (c) {
      return '<rect x="15" y="14" width="34" height="25" rx="3.5"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M8 46h48"' + S(c.glyph, 5) + '/>' +
        '<path d="M36.5 22.5A7.5 7.5 0 1 0 36.5 30.5"' + S(c.alt, 3.2) + '/>'; } },
    { name: "Laptop with prompt", note: "laptop, terminal", draw: function (c) {
      return '<rect x="15" y="14" width="34" height="25" rx="3.5"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M8 46h48"' + S(c.glyph, 5) + '/>' +
        '<path d="M23 21l6 5.5-6 5.5"' + S(c.alt, 3.2) + '/>' +
        '<path d="M33 33h9"' + S(c.alt, 3.2) + '/>'; } },
    { name: "Game controller", note: "generic gamepad", draw: function (c) {
      return '<path d="M20 22h24c5.5 0 8.5 4.5 9.5 10.5l1.6 9c.6 3.6-1.6 6.5-4.8 6.5-2.6 0-4.3-1.6-5.9-4.3l-1.6-2.7H21.2l-1.6 2.7c-1.6 2.7-3.3 4.3-5.9 4.3-3.2 0-5.4-2.9-4.8-6.5l1.6-9C11.5 26.5 14.5 22 20 22z"' + F(c.glyph) + '/>' +
        '<path d="M23.5 27.5v9M19 32h9"' + S(c.hole, 2.8) + '/>' +
        '<circle cx="40.5" cy="30.5" r="2.2"' + F(c.hole) + '/><circle cx="45" cy="35" r="2.2"' + F(c.hole) + '/>'; } },
    { name: "Handheld console", note: "game", draw: function (c) {
      return '<rect x="18" y="11" width="28" height="42" rx="6"' + S(c.glyph, 3.2) + '/>' +
        '<rect x="23" y="16" width="18" height="14" rx="2"' + F(c.alt) + '/>' +
        '<path d="M27 37v8M23 41h8"' + S(c.glyph, 2.8) + '/>' +
        '<circle cx="38" cy="39" r="2.1"' + F(c.glyph) + '/><circle cx="41.5" cy="44" r="2.1"' + F(c.glyph) + '/>'; } },
    { name: "Geometric C", note: "initial", draw: function (c) {
      return '<path d="M46 22.5A16 16 0 1 0 46 41.5"' + S(c.glyph, 7.5) + '/>' +
        '<rect x="41" y="29" width="7" height="7" rx="1.5"' + F(c.alt) + '/>'; } },
    { name: "Two Cs", note: "initials CC", draw: function (c) {
      return '<path d="M34.5 24.5A11 11 0 1 0 34.5 39.5"' + S(c.glyph, 5.5) + '/>' +
        '<path d="M47.5 24.5A11 11 0 1 0 47.5 39.5"' + S(c.alt, 5.5) + '/>'; } },
    { name: "Circuit C", note: "initial, matches the hero", draw: function (c) {
      return '<path d="M45 20H28a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h17"' + S(c.glyph, 4) + '/>' +
        '<circle cx="46.5" cy="20" r="3.4"' + F(c.alt) + '/><circle cx="46.5" cy="44" r="3.4"' + F(c.alt) + '/>' +
        '<path d="M22 32h-8"' + S(c.alt, 3) + '/><circle cx="12" cy="32" r="2.6"' + F(c.alt) + '/>'; } },
    { name: "C in brackets", note: "initial, code", draw: function (c) {
      return '<path d="M22 15h-8v34h8M42 15h8v34h-8"' + S(c.glyph, 3.6) + '/>' +
        '<path d="M38.5 26.5A8.5 8.5 0 1 0 38.5 37.5"' + S(c.alt, 4.4) + '/>'; } },
    { name: "Pixel C", note: "initial, 8-bit", draw: function (c) {
      var rows = ["01111110","11000011","11000000","11000000","11000000","11000000","11000011","01111110"], out = "", r, k;
      for (r = 0; r < 8; r++) for (k = 0; k < 8; k++) if (rows[r].charAt(k) === "1")
        out += '<rect x="' + (12 + k * 5) + '" y="' + (12 + r * 5) + '" width="5.2" height="5.2"' + F(c.glyph) + '/>';
      return out + '<rect x="38" y="27" width="5.2" height="10.2"' + F(c.alt) + '/>'; } },
    { name: "Hexagon C", note: "initial", draw: function (c) {
      return '<path d="M32 10l19 11v22L32 54 13 43V21z"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M37.7 26.3A8 8 0 1 0 37.7 37.7"' + S(c.alt, 4) + '/>'; } },
    { name: "Pixel robot", note: "original character", draw: function (c) {
      return '<rect x="16" y="21" width="32" height="26" rx="6"' + F(c.glyph) + '/>' +
        '<path d="M32 21v-7"' + S(c.glyph, 3) + '/><circle cx="32" cy="12" r="3.4"' + F(c.alt) + '/>' +
        '<rect x="23" y="29" width="6" height="7" rx="1.2"' + F(c.hole) + '/><rect x="35" y="29" width="6" height="7" rx="1.2"' + F(c.hole) + '/>' +
        '<rect x="25" y="40" width="14" height="3" rx="1.2"' + F(c.hole) + '/>' +
        '<rect x="11" y="30" width="4" height="9" rx="1.6"' + F(c.alt) + '/><rect x="49" y="30" width="4" height="9" rx="1.6"' + F(c.alt) + '/>'; } },
    { name: "Keycap C", note: "keyboard (see the Keycap C view for variants)", draw: function (c) {
      return '<rect x="12" y="12" width="40" height="40" rx="9"' + S(c.glyph, 3.2) + '/>' +
        '<rect x="18" y="17" width="28" height="26" rx="5.5"' + F(c.alt) + '/>' +
        '<path d="M37.5 25.5A7.5 7.5 0 1 0 37.5 34.5"' + S(c.hole, 3.4) + '/>'; } },
    { name: "Cursor", note: "pointer", draw: function (c) {
      return '<path d="M22 13v35l8.5-8.2 5 10.7 6.2-2.9-5-10.4H46z"' + F(c.glyph) + ' stroke="' + c.glyph + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M44 19a9 9 0 0 1 4 7M47 14a15 15 0 0 1 6 11"' + S(c.alt, 2.6) + '/>'; } },
    { name: "Terminal window", note: "developer", draw: function (c) {
      return '<rect x="10" y="14" width="44" height="36" rx="5"' + S(c.glyph, 3.2) + '/>' +
        '<path d="M10 24h44"' + S(c.glyph, 2.6) + '/>' +
        '<circle cx="16.5" cy="19" r="1.6"' + F(c.alt) + '/><circle cx="22" cy="19" r="1.6"' + F(c.alt) + '/><circle cx="27.5" cy="19" r="1.6"' + F(c.alt) + '/>' +
        '<path d="M19 33l7 5.5-7 5.5"' + S(c.glyph, 3.2) + '/><path d="M30 44h12"' + S(c.alt, 3.2) + '/>'; } }
  ];

  function allSvg(logo, bg, mode, size) {
    var pal = PALETTES[mode], tile = "", c;
    if (pal.tile) {
      c = { tile: pal.tile, glyph: pal.glyph, alt: pal.alt, hole: pal.tile };
      tile = '<rect width="64" height="64" rx="14" fill="' + pal.tile + '"/>';
    } else {
      c = { glyph: pal.glyph, alt: pal.alt, hole: bg ? bg.color : "#000000" };
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 64 64" role="img" aria-label="' + logo.name + '">' +
      tile + logo.draw(c) + '</svg>';
  }

  /* ========================= view 2: keycap C =========================== */
  var ROLES = [
    ["tile", "Tile (outer background)"], ["inner", "Keycap background (inside the ring)"], ["top", "Main: top face"], ["body", "Secondary: body and sides"],
    ["letter", "Letter C"], ["shadow", "Shadow"], ["highlight", "Highlight"], ["outline", "Outline"]
  ];
  /* order: tile, top, body, letter, shadow, highlight, outline */
  var PRESETS = [
    ["Pine on cream", "#dce7e3", "#17665f", "#0e4640", "#f8f6f1", "#06201d", "#5eead4", "#0b3633", "#f6f1e7"],
    ["Pine tile, cream key", "#17665f", "#f8f6f1", "#d6d0c2", "#17665f", "#3d3a31", "#ffffff", "#0e4640"],
    ["Teal on night", "#0f1115", "#2dd4a7", "#0f6b58", "#0b1411", "#03231c", "#9ff5de", "#2dd4a7"],
    ["Midnight key", "#0f1115", "#1d212a", "#151820", "#2dd4a7", "#000000", "#3a4150", "#2a2f3a"],
    ["Paper (light theme)", "#ebe7de", "#f8f6f1", "#cdc7ba", "#17665f", "#5f5b50", "#ffffff", "#17665f"],
    ["Slate ink", "#ffffff", "#334155", "#1e293b", "#f8fafc", "#0f172a", "#64748b", "#0f172a"],
    ["Retro beige", "#3b3b3b", "#e8e0cf", "#c9bea5", "#4a4a4a", "#7a705c", "#fffaf0", "#a99d83"],
    ["Sunset", "#1b1020", "#f97316", "#c2410c", "#1b1020", "#5a1d05", "#fdba74", "#fb923c"],
    ["Coral", "#fff1f2", "#e11d48", "#9f1239", "#fff1f2", "#4c0519", "#fda4af", "#881337"],
    ["Violet", "#150f24", "#7c3aed", "#5b21b6", "#f5f3ff", "#2e1065", "#c4b5fd", "#a78bfa"],
    ["Gold", "#1c1405", "#fbbf24", "#b45309", "#3b2a05", "#5a2d05", "#fde68a", "#f59e0b"],
    ["Ocean", "#06202b", "#22d3ee", "#0e7490", "#06202b", "#032a35", "#a5f3fc", "#67e8f9"],
    ["Mono white", "#000000", "#ffffff", "#b8b8b8", "#000000", "#444444", "#ffffff", "#ffffff"],
    ["Cream and ink", "#f2efe8", "#22211d", "#0d0c0a", "#f2efe8", "#000000", "#5f5b50", "#22211d"]
  ];
  function presetColors(i) {
    var p = PRESETS[i], o = {}, k, order = ["tile", "top", "body", "letter", "shadow", "highlight", "outline"];
    for (k = 0; k < order.length; k++) o[order[k]] = p[k + 1];
    o.inner = p[8] || p[1];
    return o;
  }

  /* The letter C as an arc; ky < 1 squashes it vertically for a tilted face. */
  function cArc(cx, cy, r, ky, w, color) {
    var dx = r * 0.643, dy = r * 0.766 * ky;
    return '<path d="M' + n(cx + dx) + ' ' + n(cy - dy) + 'A' + n(r) + ' ' + n(r * ky) + ' 0 1 0 ' + n(cx + dx) + ' ' + n(cy + dy) + '"' + S(color, w) + '/>';
  }
  function OL(p, q) { return q.outlineW > 0 ? ' stroke="' + p.outline + '" stroke-width="' + q.outlineW + '" stroke-linejoin="round"' : ''; }

  /* A shadow overlay with a fade across the shape: where = lip | bottom | left | right. */
  function shade(u, d, p, q, where) {
    var x1 = 0, y1 = 0, x2 = 0, y2 = 1;
    if (where === "bottom") { y1 = 1; y2 = 0; }
    if (where === "left") { x2 = 1; y2 = 0; }
    if (where === "right") { x1 = 1; x2 = 0; y2 = 0; }
    return '<defs><linearGradient id="' + u + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
      '<stop offset="0" stop-color="' + p.shadow + '" stop-opacity="' + n(q.shadowAlpha) + '"/>' +
      '<stop offset="1" stop-color="' + p.shadow + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + d + '" fill="url(#' + u + ')"/>';
  }
  var TOPD = "M21 8H43Q46 8 47 11L50 21Q50.8 24.5 47.5 24.5H16.5Q13.2 24.5 14 21L17 11Q18 8 21 8Z";
  var FRONTD = "M11.5 20H52.5L56 50Q56.6 56 50.5 56H13.5Q7.4 56 8 50Z";
  var HL = '<path d="M19 12.5Q19.5 10 22 10H32"' + S("HLC", 1.6) + ' opacity="0.75"/>';
  function hl(p) { return HL.replace("HLC", p.highlight); }
  function tilePos(q) { return q.shadowPos === "lip" ? "bottom" : q.shadowPos; }

  var KEYS = [
    { name: "Top-down, solid", note: "camera straight above", draw: function (p, q, u) {
      return '<rect x="8" y="8" width="48" height="48" rx="11"' + F(p.body) + OL(p, q) + '/>' +
        shade(u + "a", "M19 8H45Q56 8 56 19V45Q56 56 45 56H19Q8 56 8 45V19Q8 8 19 8Z", p, q, tilePos(q)) +
        '<rect x="14" y="12" width="36" height="34" rx="8"' + F(p.top) + '/>' +
        '<path d="M18.5 22Q18.5 17 23.5 17H34"' + S(p.highlight, 2) + ' opacity="0.75"/>' +
        cArc(32, 29, 9, 1, 4.2, p.letter); } },
    { name: "Top-down, ring", note: "outlined body", draw: function (p, q, u) {
      return '<rect x="9.7" y="9.7" width="44.6" height="44.6" rx="10"' + S(p.body, 3.4) + '/>' +
        '<rect x="16" y="15" width="32" height="30" rx="6.5"' + F(p.top) + OL(p, q) + '/>' +
        shade(u + "a", "M22.5 15H41.5Q48 15 48 21.5V38.5Q48 45 41.5 45H22.5Q16 45 16 38.5V21.5Q16 15 22.5 15Z", p, q, tilePos(q)) +
        cArc(32, 30, 8, 1, 4, p.letter); } },
    { name: "Top-down ring, lower camera", note: "ring kept, shorter top face with the ring's light blend, soft dark front wall to the ring corners, C squeezed", draw: function (p, q, u) {
      var wall = "M16 24V33.4L8.5 56H55.5L48 33.4V24Z";
      var top = "M22.5 13.4H41.5Q48 13.4 48 19.9V26.9Q48 33.4 41.5 33.4H22.5Q16 33.4 16 26.9V19.9Q16 13.4 22.5 13.4Z";
      var wallJoin = ' stroke-width="3" stroke-linejoin="round" clip-path="url(#' + u + 'c)"';
      return '<defs><clipPath id="' + u + 'c"><rect x="11.4" y="11.4" width="41.2" height="41.2" rx="8.3"/></clipPath>' +
        '<linearGradient id="' + u + 'w" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + p.shadow + '" stop-opacity="' + n(q.shadowAlpha * 0.7) + '"/>' +
        '<stop offset="1" stop-color="' + p.shadow + '" stop-opacity="' + n(q.shadowAlpha * 0.3) + '"/></linearGradient></defs>' +
        '<rect x="9.7" y="9.7" width="44.6" height="44.6" rx="10"' + S(p.body, 3.4) + '/>' +
        '<path d="' + wall + '"' + F(p.body) + ' stroke="' + p.body + '"' + wallJoin + '/>' +
        '<path d="' + wall + '" fill="url(#' + u + 'w)" stroke="url(#' + u + 'w)"' + wallJoin + '/>' +
        '<path d="' + top + '"' + F(p.top) + OL(p, q) + '/>' +
        shade(u + "t", top, p, q, "bottom") +
        '<g transform="translate(32 23.4) scale(1 0.62)">' + cArc(0, 0, 8.5, 1, 4.4, p.letter) + '</g>'; } },
    { name: "Front view, camera slightly above", note: "front face with shadow", draw: function (p, q, u) {
      var top = "M20 9H44Q47.5 9 48.5 12.5L52.5 29Q53.5 33 49.5 33H14.5Q10.5 33 11.5 29L15.5 12.5Q16.5 9 20 9Z";
      var front = "M10 30H54L57 47Q57.6 52 52 52H12Q6.4 52 7 47Z";
      return '<path d="' + front + '"' + F(p.body) + OL(p, q) + '/>' + shade(u + "a", front, p, q, q.shadowPos) +
        '<path d="' + top + '"' + F(p.top) + OL(p, q) + '/>' +
        '<path d="M17.5 14.5Q18 11 21 11H33"' + S(p.highlight, 1.8) + ' opacity="0.75"/>' +
        cArc(32, 21.5, 8, 0.66, 3.6, p.letter); } },
    { name: "Low camera, tall key, soft shadow on the front", note: "legend on the top", draw: function (p, q, u) {
      return '<path d="' + FRONTD + '"' + F(p.body) + OL(p, q) + '/>' + shade(u + "a", FRONTD, p, q, q.shadowPos) +
        '<path d="' + TOPD + '"' + F(p.top) + OL(p, q) + '/>' + hl(p) +
        cArc(32, 16.5, 7, 0.5, 3, p.letter); } },
    { name: "Low camera, tall key, legend on the front", note: "big C on the front face", draw: function (p, q, u) {
      return '<path d="' + FRONTD + '"' + F(p.body) + OL(p, q) + '/>' + shade(u + "a", FRONTD, p, q, q.shadowPos) +
        '<path d="' + TOPD + '"' + F(p.top) + OL(p, q) + '/>' + hl(p) +
        cArc(32, 40.5, 9.5, 1, 4.4, p.letter); } },
    { name: "Low camera, hard-edged shadow", note: "cel-shaded band on the front", draw: function (p, q, u) {
      var band = q.shadowPos === "bottom" ? "M0 46L64 40V64H0Z" : q.shadowPos === "left" ? "M0 0H27L21 64H0Z" : q.shadowPos === "right" ? "M43 0H64V64H37Z" : "M0 0H64V33L0 39Z";
      return '<defs><clipPath id="' + u + 'c"><path d="' + FRONTD + '"/></clipPath></defs>' +
        '<path d="' + FRONTD + '"' + F(p.body) + OL(p, q) + '/>' +
        '<path d="' + band + '" clip-path="url(#' + u + 'c)"' + F(p.shadow) + ' fill-opacity="' + n(q.shadowAlpha) + '"/>' +
        '<path d="' + TOPD + '"' + F(p.top) + OL(p, q) + '/>' + hl(p) +
        cArc(32, 16.5, 7, 0.5, 3, p.letter); } },
    { name: "Isometric", note: "three faces", draw: function (p, q, u) {
      var topP = "M32 9L54 21L32 33L10 21Z", left = "M10 21L32 33V55L10 43Z", right = "M32 33L54 21V43L32 55Z";
      var ol = q.outlineW > 0 ? ' stroke="' + p.outline + '" stroke-width="' + q.outlineW + '" stroke-linejoin="round"' : ' stroke-linejoin="round"';
      function edge(c) { return q.outlineW > 0 ? '' : ' stroke="' + c + '" stroke-width="1.5"'; }
      return '<path d="' + left + '"' + F(p.body) + ol + edge(p.body) + '/>' +
        '<path d="' + right + '"' + F(p.body) + ol + edge(p.body) + '/>' +
        '<path d="' + (q.shadowPos === "left" ? left : right) + '" fill="' + p.shadow + '" fill-opacity="' + n(q.shadowAlpha) + '"/>' +
        '<path d="' + topP + '"' + F(p.top) + ol + edge(p.top) + '/>' +
        '<path d="M12 21L32 11.5L52 21"' + S(p.highlight, 1.6) + ' opacity="0.7"/>' +
        '<g transform="matrix(0.866 0.5 -0.866 0.5 32 21)">' + cArc(0, 0, 7.5, 1, 3.4, p.letter) + '</g>'; } },
    { name: "Top-down with cursor", note: "C and a blinking cursor", draw: function (p, q, u) {
      return '<rect x="8" y="8" width="48" height="48" rx="11"' + F(p.body) + OL(p, q) + '/>' +
        shade(u + "a", "M19 8H45Q56 8 56 19V45Q56 56 45 56H19Q8 56 8 45V19Q8 8 19 8Z", p, q, tilePos(q)) +
        '<rect x="14" y="12" width="36" height="34" rx="8"' + F(p.top) + '/>' +
        cArc(27.5, 29, 8, 1, 4, p.letter) + '<rect x="38" y="35" width="9" height="3.6" rx="1.2"' + F(p.highlight) + '/>'; } },
    { name: "Pixel keycap", note: "8-bit, stepped corners", draw: function (p, q, u) {
      var rows = ["01111","11000","10000","10000","10000","11000","01111"], out = "", r, k;
      for (r = 0; r < 7; r++) for (k = 0; k < 5; k++) if (rows[r].charAt(k) === "1")
        out += '<rect x="' + (22 + k * 4) + '" y="' + (15 + r * 4) + '" width="4.1" height="4.1"' + F(p.letter) + '/>';
      return '<path d="M12 8H52V12H56V52H52V56H12V52H8V12H12Z"' + F(p.body) + OL(p, q) + '/>' +
        '<path d="M12 48H52V52H12Z" fill="' + p.shadow + '" fill-opacity="' + n(q.shadowAlpha) + '"/>' +
        '<path d="M16 12H48V16H52V42H48V46H16V42H12V16H16Z"' + F(p.top) + '/>' +
        '<path d="M16 12H30V14H16Z"' + F(p.highlight) + ' fill-opacity="0.75"/>' + out; } }
  ];

  function keySvg(item, p, q, size) {
    var tile = "";
    if (q.showTile) tile = '<rect width="64" height="64" rx="' + q.radius + '" fill="' + p.tile + '"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 64 64" role="img" aria-label="' + item.name + '">' +
      tile + item.draw(p, q, uid()) + '</svg>';
  }

  /* ========================= view 3: ring editor ======================== */
  var RING_CTL = [
    ["ow", "Outer width", 20, 58, 0.5, 44.6], ["oh", "Outer height", 20, 58, 0.5, 44.6],
    ["st", "Ring thickness", 1, 8, 0.2, 3.4], ["or", "Outer corner radius", 0, 26, 0.5, 10],
    ["iw", "Inner width", 8, 54, 0.5, 32], ["ih", "Inner height", 8, 54, 0.5, 25.5],
    ["ir", "Inner corner radius", 0, 20, 0.5, 6.5], ["gap", "Gap, ring to inner (top)", 0, 12, 0.2, 1.6],
    ["cs", "Letter size", 3, 16, 0.5, 8], ["ky", "Letter squeeze (height)", 0.3, 1, 0.02, 0.82],
    ["cw", "Letter thickness", 1.5, 8, 0.1, 4],
    ["gw", "Shadow: gradient width", 0, 14, 0.1, 6], ["gc", "Shadow: gradient curve (0 straight, 1 smooth)", 0, 1, 0.05, 1],
    ["sp", "Shadow: spread (wider each side)", -4, 12, 0.2, 3], ["fo", "Shadow: gradient start (inward from the edge)", -4, 12, 0.2, 2.2],
    ["sa", "Shadow: edge slant (0 parallel, + / - tilts the fade)", -20, 20, 0.5, 0], ["ds", "Shadow: strength", 0, 1, 0.05, 0.55],
    ["lw", "Light: gradient width", 0, 14, 0.1, 5], ["lc", "Light: gradient curve (0 straight, 1 smooth)", 0, 1, 0.05, 1],
    ["lp", "Light: spread (wider each side)", -4, 12, 0.2, 0], ["lf", "Light: gradient start (inward from the edge)", -4, 12, 0.2, 0],
    ["lsa", "Light: edge slant (0 parallel, + / - tilts the fade)", -20, 20, 0.5, 0], ["ls", "Light: strength", 0, 1, 0.05, 0.85]
  ];
  function ringDefaults() {
    var o = { wall: true, light: true }, i;
    for (i = 0; i < RING_CTL.length; i++) o[RING_CTL[i][0]] = RING_CTL[i][5];
    return o;
  }
  function rr(x, y, w, h, r) {
    return "M" + n(x + r) + " " + n(y) + "H" + n(x + w - r) + "Q" + n(x + w) + " " + n(y) + " " + n(x + w) + " " + n(y + r) +
      "V" + n(y + h - r) + "Q" + n(x + w) + " " + n(y + h) + " " + n(x + w - r) + " " + n(y + h) + "H" + n(x + r) +
      "Q" + n(x) + " " + n(y + h) + " " + n(x) + " " + n(y + h - r) + "V" + n(y + r) + "Q" + n(x) + " " + n(y) + " " + n(x + r) + " " + n(y) + "Z";
  }
  function ringSvg(p, q, r, size) {
    var u = uid(), st = r.st, ow = r.ow, oh = r.oh, ox = 32 - ow / 2, oy = 32 - oh / 2;
    var iw = Math.min(r.iw, ow - st - 1), ih = Math.min(r.ih, oh - st - r.gap - 1);
    var ix = 32 - iw / 2, iy = oy + st / 2 + r.gap;
    var orad = Math.min(r.or, ow / 2, oh / 2), irad = Math.min(r.ir, iw / 2, ih / 2);
    var tile = q.showTile ? '<rect width="64" height="64" rx="' + q.radius + '" fill="' + p.tile + '"/>' : "";
    var topD = rr(ix, iy, iw, ih, irad), wall = "", cy = iy + ih / 2;
    var bands = "";
    if (r.wall) {
      var sp0 = r.sp, fo0 = r.fo, iyb = iy + ih, yb = oy + oh - 1, W = r.gw, N = 32, layers = "", kk, hk, ytop = iyb - irad, gcv = r.gc, ease = function (t) { return (1 - gcv) * t + gcv * (t * t * t * (t * (6 * t - 15) + 10)); };
      var slp = yb > iyb ? (ox + 1 - ix) / (yb - iyb) : 0, xtop = ix - slp * irad;
      for (kk = 0; kk < N; kk++) {
        hk = W * kk / N;
        var sh = fo0 - sp0 + hk, sht = sh + r.sa * kk / N;
        layers += '<path d="M' + n(xtop + sht) + ' ' + n(ytop) + 'L' + n(ox + 1 + sh) + ' ' + n(yb) + 'H' + n(ox + ow - 1 - sh) + 'L' + n(64 - xtop - sht) + ' ' + n(ytop) + 'Z" fill="' + p.shadow + '" fill-opacity="' + (W > 0 ? (1 - (1 - ease((kk + 1) / N)) / (1 - ease(kk / N))).toFixed(4) : "1") + '"/>';
        if (W <= 0) break;
      }
      wall = '<g clip-path="url(#' + u + 'c)" opacity="' + n(r.ds) + '">' + layers + '</g>';
    }
    var clipDef = '<defs><clipPath id="' + u + 'c"><rect x="' + n(ox + st / 2) + '" y="' + n(oy + st / 2) + '" width="' + n(ow - st) + '" height="' + n(oh - st) + '" rx="' + n(Math.max(0, orad - st / 2)) + '"/></clipPath></defs>';
    var light = "";
    if (r.light) {
      var yt = oy + st / 2, xr0 = ox + st / 2, span = iy - yt, y0 = yt - 1.5, y1 = iy + 1.2, LN = 32, ll = "", lk, lh, lg = r.lc;
      var le = function (t) { return (1 - lg) * t + lg * (t * t * t * (t * (6 * t - 15) + 10)); };
      var xl = function (y) { return span > 0.05 ? xr0 + (ix - xr0) * (y - yt) / span : ix; };
      for (lk = 0; lk < LN; lk++) {
        lh = r.lf - r.lp + r.lw * lk / LN;
        ll += '<path d="M' + n(xl(y0) + lh) + ' ' + n(y0) + 'L' + n(xl(y1) + lh + r.lsa * lk / LN) + ' ' + n(y1) + 'H' + n(64 - xl(y1) - lh - r.lsa * lk / LN) + 'L' + n(64 - xl(y0) - lh) + ' ' + n(y0) + 'Z" fill="' + p.highlight + '" fill-opacity="' + (r.lw > 0 ? (1 - (1 - le((lk + 1) / LN)) / (1 - le(lk / LN))).toFixed(4) : "1") + '"/>';
        if (r.lw <= 0) break;
      }
      light = '<g clip-path="url(#' + u + 'c)" opacity="' + n(r.ls) + '">' + ll + '</g>';
    }
    var vbm = Math.max(ow, oh) + st, vb = q.showTile ? "0 0 64 64" : n(32 - vbm / 2) + " " + n(32 - vbm / 2) + " " + n(vbm) + " " + n(vbm);
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="' + vb + '" role="img" aria-label="Top-down ring">' + tile +
      '<rect x="' + n(ox) + '" y="' + n(oy) + '" width="' + n(ow) + '" height="' + n(oh) + '" rx="' + n(orad) + '"' + F(p.inner || p.tile) + '/>' +
      '<rect x="' + n(ox) + '" y="' + n(oy) + '" width="' + n(ow) + '" height="' + n(oh) + '" rx="' + n(orad) + '"' + S(p.body, st) + '/>' + clipDef + wall + light +
      '<path d="' + topD + '"' + F(p.top) + OL(p, q) + '/>' + shade(u + "t", topD, p, q, "bottom") + bands +
      '<g transform="translate(32 ' + n(cy) + ') scale(1 ' + n(r.ky) + ')">' + cArc(0, 0, r.cs, 1, r.cw, p.letter) + '</g></svg>';
  }

  /* ============================= state ================================== */
  var state = { view: "all", mode: "pine", allSel: 0, kSel: 3, preset: 0,
    colors: presetColors(0), shadowAlpha: 0.55, shadowPos: "lip", outlineW: 0, radius: 14, showTile: true, custom: false, ring: ringDefaults(), bigBg: 1, bigSize: 420 };
  function load() {
    try {
      var raw = window.localStorage.getItem("logo-state");
      if (raw) { var s = JSON.parse(raw), k; for (k in s) if (s.hasOwnProperty(k)) state[k] = s[k]; }
    } catch (e) { /* ignore */ }
    if (window.location.hash === "#keycap") state.view = "key";
    if (window.location.hash === "#all") state.view = "all";
    if (window.location.hash === "#ring") state.view = "ring";
    var dflt = ringDefaults(), dk;
    if (!state.ring) { state.ring = dflt; }
    else { for (dk in dflt) if (dflt.hasOwnProperty(dk) && state.ring[dk] === undefined) state.ring[dk] = dflt[dk]; }
    if (state.colV !== 1) { state.colors = presetColors(state.preset); state.custom = false; state.colV = 1; }
    if (!state.colors.inner) state.colors.inner = state.colors.tile;
  }
  function save() { try { window.localStorage.setItem("logo-state", JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function $(id) { return document.getElementById(id); }

  /* ============================== render ================================ */
  function cardsHTML(items, svgFn, sel) {
    var html = "", i, j;
    for (i = 0; i < items.length; i++) {
      html += '<section class="card' + (i === sel ? ' sel' : '') + '" data-i="' + i + '"><h2>' + (i + 1) + ". " + items[i].name + "<small>" + items[i].note + '</small></h2><div class="row">';
      for (j = 0; j < BGS.length; j++) {
        html += '<div class="bg" style="background:' + BGS[j].color + ";color:" + BGS[j].fg + '">' + svgFn(items[i], BGS[j], 96) +
          '<div class="sizes">' + svgFn(items[i], BGS[j], 32) + svgFn(items[i], BGS[j], 16) + "</div><span>" + BGS[j].name + "</span></div>";
      }
      html += "</div></section>";
    }
    return html;
  }
  function keyParams() {
    return { shadowAlpha: state.shadowAlpha, shadowPos: state.shadowPos, outlineW: state.outlineW, radius: state.radius, showTile: state.showTile };
  }
  function render() {
    var isKey = state.view === "key", isRing = state.view === "ring", q = keyParams();
    $("v-all").className = "btn" + (state.view === "all" ? " on" : "");
    $("v-key").className = "btn" + (isKey ? " on" : "");
    $("v-ring").className = "btn" + (isRing ? " on" : "");
    $("allctl").style.display = state.view === "all" ? "" : "none";
    $("keyctl").style.display = state.view === "all" ? "none" : "";
    $("ringctl").style.display = isRing ? "" : "none";
    if (isRing) {
      $("cards").innerHTML = cardsHTML([{ name: "Top-down ring, adjustable", note: "use the sliders above" }],
        function (item, bg, size) { return ringSvg(state.colors, q, state.ring, size); }, 0);
      $("selname").textContent = "Ring editor";
    } else if (isKey) {
      $("cards").innerHTML = cardsHTML(KEYS, function (item, bg, size) { return keySvg(item, state.colors, q, size); }, state.kSel);
      $("selname").textContent = "Selected: " + (state.kSel + 1) + ". " + KEYS[state.kSel].name;
    } else {
      $("cards").innerHTML = cardsHTML(LOGOS, function (item, bg, size) { return allSvg(item, bg, state.mode, size); }, state.allSel);
      $("selname").textContent = "Selected: " + (state.allSel + 1) + ". " + LOGOS[state.allSel].name;
    }
    renderBig(q);
    renderBrowser(q);
    $("out").value = valuesText();
    save();
  }
  function renderBrowser(q0) {
    var q = {}, qk;
    for (qk in q0) if (q0.hasOwnProperty(qk)) q[qk] = q0[qk];
    q.showTile = false;
    var s16 = function (z) { return ringSvg(state.colors, q, state.ring, z); };
    var tab = function (cls, name) {
      return '<div class="bt ' + cls + '"><div class="btab"><span class="bico">' + s16(16) + '</span><span class="bttl">Charles S. Carreon | Portfolio</span><span class="bx">\u00d7</span></div>' +
        '<div class="bbar"><span class="bico">' + s16(16) + '</span><span class="burl">charles-portfolio.vercel.app</span></div></div>';
    };
    var sizes = [16, 24, 32, 48, 64, 96, 180], row = function (cls) {
      var i, o = '<div class="srow ' + cls + '">';
      for (i = 0; i < sizes.length; i++) o += '<div class="sz">' + s16(sizes[i]) + '<span>' + sizes[i] + '</span></div>';
      return o + '</div>';
    };
    $("browser").innerHTML = tab("lt") + tab("dk") + row("lt") + row("dk");
    var link = document.getElementById("favlink");
    if (!link) { link = document.createElement("link"); link.id = "favlink"; link.rel = "icon"; link.type = "image/svg+xml"; document.head.appendChild(link); }
    link.href = "data:image/svg+xml," + encodeURIComponent(s16(64));
  }
  function renderBig(q) {
    var bg = BGS[state.bigBg] || BGS[1], size = state.bigSize || 420, svg;
    if (state.view === "ring") svg = ringSvg(state.colors, q, state.ring, size);
    else if (state.view === "key") svg = keySvg(KEYS[state.kSel], state.colors, q, size);
    else svg = allSvg(LOGOS[state.allSel], bg, state.mode, size);
    $("big").style.background = bg.color;
    $("big").innerHTML = svg;
  }

  /* ============================ copy values ============================= */
  function valuesText() {
    var bgNames = "pure black, the site's dark theme, the light theme Paper deeper, pure white";
    var lines, svg, k;
    if (state.view === "ring") {
      var rq = keyParams(), ri;
      svg = ringSvg(state.colors, rq, state.ring, 64).replace(/u\d+/g, function (m) { return "k" + m.slice(1); });
      lines = ["Logo: Top-down ring, adjustable (always centred horizontally)", "Ring settings:"];
      for (ri = 0; ri < RING_CTL.length; ri++) lines.push("  " + RING_CTL[ri][1] + ": " + state.ring[RING_CTL[ri][0]]);
      lines.push("  Front shadow, fading to the sides: " + (state.ring.wall ? "yes" : "no"), "  Light in the top gap: " + (state.ring.light ? "yes" : "no"), "Colours:");
      for (k = 0; k < ROLES.length; k++) lines.push("  " + ROLES[k][1] + ": " + state.colors[ROLES[k][0]]);
      lines.push("Shadow strength: " + Math.round(state.shadowAlpha * 100) + "%", "Outline width: " + state.outlineW,
        "Tile shown: " + (state.showTile ? "yes" : "no"), "Tile corner radius: " + state.radius,
        "Checked on: " + bgNames, "SVG (64 x 64):", svg);
    } else if (state.view === "key") {
      var it = KEYS[state.kSel], q = keyParams();
      svg = keySvg(it, state.colors, q, 64).replace(/u\d+/g, function (m) { return "k" + m.slice(1); });
      lines = ["Logo: Keycap C, variant " + (state.kSel + 1) + ": " + it.name + " (" + it.note + ")",
        "Preset: " + (state.custom ? "custom (started from " + PRESETS[state.preset][0] + ")" : PRESETS[state.preset][0]),
        "Colours:"];
      for (k = 0; k < ROLES.length; k++) lines.push("  " + ROLES[k][1] + ": " + state.colors[ROLES[k][0]]);
      lines.push("Shadow strength: " + Math.round(state.shadowAlpha * 100) + "%", "Shadow on the key: " + state.shadowPos,
        "Outline width: " + state.outlineW, "Tile shown: " + (state.showTile ? "yes" : "no"), "Tile corner radius: " + state.radius,
        "Checked on: " + bgNames, "SVG (64 x 64):", svg);
    } else {
      var lg = LOGOS[state.allSel];
      svg = allSvg(lg, null, state.mode, 64);
      lines = ["Logo: " + (state.allSel + 1) + ". " + lg.name + " (" + lg.note + ")", "Colours: " + PALETTES[state.mode].label,
        "Checked on: " + bgNames, "SVG (64 x 64):", svg];
    }
    return lines.join("\n");
  }
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.style.opacity = "1";
    window.setTimeout(function () { t.style.opacity = "0"; }, 1600);
  }
  function copy() {
    var text = valuesText(), ta = $("out");
    ta.value = text;
    function fallback() {
      try { ta.select(); document.execCommand("copy"); toast("Copied"); }
      catch (e) { toast("Select the text under Values to share and copy it"); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied"); }, fallback);
    } else { fallback(); }
  }

  /* ============================== controls ============================== */
  function buildKeyControls() {
    var sel = "", html = "", i;
    for (i = 0; i < PRESETS.length; i++) sel += '<option value="' + i + '">' + PRESETS[i][0] + "</option>";
    $("preset").innerHTML = sel;
    for (i = 0; i < ROLES.length; i++) {
      html += '<div class="field"><label for="c-' + ROLES[i][0] + '">' + ROLES[i][1] + '</label><code id="h-' + ROLES[i][0] + '"></code>' +
        '<input type="color" id="c-' + ROLES[i][0] + '" data-role="' + ROLES[i][0] + '"></div>';
    }
    $("pickers").innerHTML = html;
  }
  function buildRingControls() {
    var html = "", i, d;
    for (i = 0; i < RING_CTL.length; i++) {
      d = RING_CTL[i];
      html += '<div class="field"><label for="r-' + d[0] + '">' + d[1] + '</label><input type="range" id="r-' + d[0] + '" data-ring="' + d[0] +
        '" min="' + d[2] + '" max="' + d[3] + '" step="' + d[4] + '"><output id="ro-' + d[0] + '"></output></div>';
    }
    html += '<div class="field"><label for="r-wall">Front shadow (fades to the sides)</label><input type="checkbox" id="r-wall" data-ring="wall"></div>' +
      '<div class="field"><label for="r-light">Light in the top gap (trapezoid)</label><input type="checkbox" id="r-light" data-ring="light"></div>' +
      '<div class="field"><button class="btn" id="r-reset" type="button">Reset ring</button></div>';
    $("ringsliders").innerHTML = html;
  }
  function buildBigControls() {
    var html = "", i;
    for (i = 0; i < BGS.length; i++) html += '<option value="' + i + '">' + BGS[i].name + "</option>";
    $("bigbg").innerHTML = html;
  }
  function syncBigControls() {
    $("bigbg").value = String(state.bigBg);
    $("bigsize").value = String(state.bigSize);
    $("bigsizeO").textContent = String(state.bigSize);
  }
  function syncRingControls() {
    var i, k;
    for (i = 0; i < RING_CTL.length; i++) {
      k = RING_CTL[i][0];
      $("r-" + k).value = String(state.ring[k]);
      $("ro-" + k).textContent = String(state.ring[k]);
    }
    $("r-wall").checked = !!state.ring.wall;
    $("r-light").checked = !!state.ring.light;
  }
  function syncKeyControls() {
    var i, r;
    $("preset").value = String(state.preset);
    for (i = 0; i < ROLES.length; i++) {
      r = ROLES[i][0];
      $("c-" + r).value = state.colors[r];
      $("h-" + r).textContent = state.colors[r];
    }
    $("shAlpha").value = String(Math.round(state.shadowAlpha * 100));
    $("shAlphaO").textContent = Math.round(state.shadowAlpha * 100) + "%";
    $("shPos").value = state.shadowPos;
    $("olW").value = String(state.outlineW);
    $("olWO").textContent = String(state.outlineW);
    $("radius").value = String(state.radius);
    $("radiusO").textContent = String(state.radius);
    $("showTile").checked = !!state.showTile;
    $("mode").value = state.mode;
  }

  function onInput(e) {
    var t = e.target, id = t.id, role = t.getAttribute ? t.getAttribute("data-role") : null;
    if (id === "bigbg") { state.bigBg = parseInt(t.value, 10); syncBigControls(); render(); return; }
    if (id === "bigsize") { state.bigSize = parseInt(t.value, 10); syncBigControls(); render(); return; }
    var ringKey = t.getAttribute ? t.getAttribute("data-ring") : null;
    if (ringKey) {
      if (ringKey === "wall" || ringKey === "light") { state.ring[ringKey] = !!t.checked; }
      else { state.ring[ringKey] = parseFloat(t.value); $("ro-" + ringKey).textContent = t.value; }
      render(); return;
    }
    if (role) {
      state.colors[role] = t.value; state.custom = true;
      $("h-" + role).textContent = t.value;
    } else if (id === "preset") { state.preset = parseInt(t.value, 10); state.colors = presetColors(state.preset); state.custom = false; syncKeyControls(); }
    else if (id === "shAlpha") { state.shadowAlpha = parseInt(t.value, 10) / 100; $("shAlphaO").textContent = t.value + "%"; }
    else if (id === "shPos") { state.shadowPos = t.value; }
    else if (id === "olW") { state.outlineW = parseFloat(t.value); $("olWO").textContent = t.value; }
    else if (id === "radius") { state.radius = parseInt(t.value, 10); $("radiusO").textContent = t.value; }
    else if (id === "showTile") { state.showTile = !!t.checked; }
    else if (id === "mode") { state.mode = t.value; }
    else { return; }
    render();
  }
  function onClick(e) {
    var t = e.target;
    if (t.id === "v-all") { state.view = "all"; window.location.hash = "#all"; render(); return; }
    if (t.id === "v-key") { state.view = "key"; window.location.hash = "#keycap"; render(); return; }
    if (t.id === "v-ring") { state.view = "ring"; window.location.hash = "#ring"; render(); return; }
    if (t.id === "r-reset") { state.ring = ringDefaults(); syncRingControls(); render(); return; }
    if (t.id === "copy") { copy(); return; }
    if (t.id === "reset") {
      state.colors = presetColors(state.preset); state.custom = false; state.shadowAlpha = 0.55; state.shadowPos = "lip";
      state.outlineW = 0; state.radius = 14; state.showTile = true; syncKeyControls(); render(); return;
    }
    while (t && t.getAttribute && t.getAttribute("data-i") === null) { t = t.parentNode; }
    if (t && t.getAttribute) {
      var i = parseInt(t.getAttribute("data-i"), 10);
      if (state.view === "key") state.kSel = i; else state.allSel = i;
      render();
    }
  }

  load();
  buildKeyControls();
  syncKeyControls();
  buildRingControls();
  syncRingControls();
  buildBigControls();
  syncBigControls();
  document.addEventListener("input", onInput);
  document.addEventListener("change", onInput);
  document.addEventListener("click", onClick);
  render();
})();
