/* ChromaCam — camera colour picker.
 * Everything runs locally: the camera frame is drawn to a canvas, a small disc
 * of pixels under the finger is averaged in linear light, then named two ways —
 * the nearest catalogued colour ("exact") and a plain-language description
 * ("everyday"), each in English and French.
 */
(function () {
'use strict';

/* ------------------------------------------------------------------ *
 * 1. Colour maths
 * ------------------------------------------------------------------ */

// sRGB byte -> linear-light, precomputed: sampling averages hundreds of pixels.
var LIN = new Float64Array(256);
for (var i = 0; i < 256; i++) {
  var c = i / 255;
  LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linToByte(v) {
  var c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(c * 255)));
}

// sRGB (0-255) -> CIE Lab, D65.
function rgbToLab(r, g, b) {
  var R = LIN[r], G = LIN[g], B = LIN[b];
  var x = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047;
  var y = (0.2126729 * R + 0.7151522 * G + 0.0721750 * B);
  var z = (0.0193339 * R + 0.1191920 * G + 0.9503041 * B) / 1.08883;
  function f(t) { return t > 0.008856451679 ? Math.cbrt(t) : (903.2962962 * t + 16) / 116; }
  var fx = f(x), fy = f(y), fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function rgbToHsl(r, g, b) {
  var R = r / 255, G = g / 255, B = b / 255;
  var mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  var l = (mx + mn) / 2, h = 0, s = 0;
  if (d) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === R) h = ((G - B) / d + (G < B ? 6 : 0));
    else if (mx === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

var DEG = Math.PI / 180;
// CIEDE2000. Worth the arithmetic here: plain RGB distance mis-ranks names badly
// in the blues and the near-neutrals, which is most of what a camera sees.
function ciede2000(l1, a1, b1, l2, a2, b2) {
  var C1 = Math.sqrt(a1 * a1 + b1 * b1), C2 = Math.sqrt(a2 * a2 + b2 * b2);
  var Cb = (C1 + C2) / 2;
  var Cb7 = Math.pow(Cb, 7);
  var G = 0.5 * (1 - Math.sqrt(Cb7 / (Cb7 + 6103515625)));
  var ap1 = (1 + G) * a1, ap2 = (1 + G) * a2;
  var Cp1 = Math.sqrt(ap1 * ap1 + b1 * b1), Cp2 = Math.sqrt(ap2 * ap2 + b2 * b2);
  var hp1 = (ap1 === 0 && b1 === 0) ? 0 : Math.atan2(b1, ap1) / DEG;
  var hp2 = (ap2 === 0 && b2 === 0) ? 0 : Math.atan2(b2, ap2) / DEG;
  if (hp1 < 0) hp1 += 360;
  if (hp2 < 0) hp2 += 360;

  var dL = l2 - l1, dC = Cp2 - Cp1, dhp = 0;
  if (Cp1 * Cp2 !== 0) {
    dhp = hp2 - hp1;
    if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360;
  }
  var dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dhp / 2 * DEG);

  var Lb = (l1 + l2) / 2, Cpb = (Cp1 + Cp2) / 2, hpb;
  if (Cp1 * Cp2 === 0) hpb = hp1 + hp2;
  else if (Math.abs(hp1 - hp2) <= 180) hpb = (hp1 + hp2) / 2;
  else hpb = (hp1 + hp2 + (hp1 + hp2 < 360 ? 360 : -360)) / 2;

  var T = 1 - 0.17 * Math.cos((hpb - 30) * DEG) + 0.24 * Math.cos(2 * hpb * DEG)
            + 0.32 * Math.cos((3 * hpb + 6) * DEG) - 0.20 * Math.cos((4 * hpb - 63) * DEG);
  var dTheta = 30 * Math.exp(-Math.pow((hpb - 275) / 25, 2));
  var Cpb7 = Math.pow(Cpb, 7);
  var Rc = 2 * Math.sqrt(Cpb7 / (Cpb7 + 6103515625));
  var Lb50 = Math.pow(Lb - 50, 2);
  var Sl = 1 + (0.015 * Lb50) / Math.sqrt(20 + Lb50);
  var Sc = 1 + 0.045 * Cpb;
  var Sh = 1 + 0.015 * Cpb * T;
  var Rt = -Math.sin(2 * dTheta * DEG) * Rc;

  return Math.sqrt(
    Math.pow(dL / Sl, 2) + Math.pow(dC / Sc, 2) + Math.pow(dH / Sh, 2) +
    Rt * (dC / Sc) * (dH / Sh)
  );
}

function hexOf(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
function parseHex(hex) {
  var n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
// WCAG relative luminance, used to pick readable ink on a swatch.
function readableInk(r, g, b) {
  return (0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b]) > 0.38 ? '#101418' : '#FFFFFF';
}

/* ------------------------------------------------------------------ *
 * 2. The named-colour catalogue
 * ------------------------------------------------------------------ */

var CATALOG = (window.CHROMACAM_COLORS || []).map(function (e) {
  var rgb = parseHex(e[0]);
  var lab = rgbToLab(rgb[0], rgb[1], rgb[2]);
  return { hex: e[0], en: e[1], fr: e[2], L: lab[0], a: lab[1], b: lab[2] };
});

// Three nearest catalogue entries, closest first.
function nearestNames(lab) {
  var best = [];
  for (var i = 0; i < CATALOG.length; i++) {
    var c = CATALOG[i];
    var d = ciede2000(lab[0], lab[1], lab[2], c.L, c.a, c.b);
    if (best.length < 3 || d < best[best.length - 1].d) {
      best.push({ c: c, d: d });
      best.sort(function (p, q) { return p.d - q.d; });
      if (best.length > 3) best.length = 3;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ *
 * 3. Everyday ("vernacular") naming
 * ------------------------------------------------------------------ */

var FAM = {
  red:      { en: 'red',          fr: 'rouge' },
  orange:   { en: 'orange',       fr: 'orange' },
  yellow:   { en: 'yellow',       fr: 'jaune' },
  lime:     { en: 'yellow-green', fr: 'jaune-vert' },
  green:    { en: 'green',        fr: 'vert' },
  turquoise:{ en: 'turquoise',    fr: 'turquoise' },
  blue:     { en: 'blue',         fr: 'bleu' },
  violet:   { en: 'violet',       fr: 'violet' },
  purple:   { en: 'purple',       fr: 'pourpre' },
  magenta:  { en: 'magenta',      fr: 'magenta' },
  brown:    { en: 'brown',        fr: 'marron' },
  beige:    { en: 'beige',        fr: 'beige' },
  olive:    { en: 'olive',        fr: 'olive' },
  pink:     { en: 'pink',         fr: 'rose' },
  lavender: { en: 'lavender',     fr: 'lavande' }
};
var LMOD = {
  vdark:  { en: 'very dark',  fr: 'très foncé' },
  dark:   { en: 'dark',       fr: 'foncé' },
  light:  { en: 'light',      fr: 'clair' },
  vlight: { en: 'very light', fr: 'très clair' },
  pale:   { en: 'pale',       fr: 'pâle' }
};
var SMOD = {
  gray:  { en: 'grayish', fr: 'grisâtre' },
  vivid: { en: 'vivid',   fr: 'vif' }
};
var NEUTRAL = [
  { max: 0.09,  en: 'black',          fr: 'noir' },
  { max: 0.30,  en: 'very dark gray', fr: 'gris très foncé' },
  { max: 0.48,  en: 'dark gray',      fr: 'gris foncé' },
  { max: 0.72,  en: 'gray',           fr: 'gris' },
  { max: 0.88,  en: 'light gray',     fr: 'gris clair' },
  { max: 0.955, en: 'off-white',      fr: 'blanc cassé' },
  { max: 2.00,  en: 'white',          fr: 'blanc' }
];

function hueFamily(h) {
  if (h < 14 || h >= 338) return 'red';
  if (h < 48)  return 'orange';
  if (h < 66)  return 'yellow';
  if (h < 82)  return 'lime';
  if (h < 168) return 'green';
  if (h < 193) return 'turquoise';
  if (h < 258) return 'blue';
  if (h < 285) return 'violet';
  if (h < 320) return 'purplish';   // resolved by lightness below
  return 'magenta';
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* Plain-language name. Hue alone is not enough — brown is a dark orange, beige a
 * muted light one, and nobody calls either "orange" — so the family is picked
 * from hue, Lab lightness and Lab chroma together.
 *
 * Lightness wording is gated on HSL lightness as well as L*. A fully saturated
 * yellow sits at L* 97 and a fully saturated blue at L* 32, yet neither is "very
 * light" or "dark" to anyone looking at it: that is simply what the hue looks
 * like at full strength. HSL lightness is what separates "yellow" from "pale
 * yellow", and it sits near 0.5 for every pure hue. */
function vernacular(r, g, b) {
  var lab = rgbToLab(r, g, b);
  var hsl = rgbToHsl(r, g, b);
  var L = lab[0] / 100;                                  // perceptual lightness
  var C = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);  // perceptual chroma
  var h = hsl[0], hl = hsl[2];

  // Chroma reads as colour less readily in the shadows, so the threshold for
  // calling something a plain grey widens as the colour gets darker.
  if (C < 10 + Math.max(0, 0.5 - L) * 14 || L < 0.055) {
    for (var i = 0; i < NEUTRAL.length; i++) {
      if (L < NEUTRAL[i].max) return { en: cap(NEUTRAL[i].en), fr: cap(NEUTRAL[i].fr) };
    }
  }

  var fam = hueFamily(h);
  // The 285-320 wedge is "purple" when dark and "magenta" when light: #800080
  // and #FF00FF share a hue and nobody calls them the same colour.
  if (fam === 'purplish') fam = L < 0.55 ? 'purple' : 'magenta';
  if (fam === 'orange') {
    if ((L < 0.58 && C < 75) || (L < 0.68 && C < 48)) fam = 'brown';
    else if (C < 44) fam = 'beige';
  }
  if ((fam === 'yellow' || fam === 'lime') && L < 0.55) fam = 'olive';
  if ((fam === 'violet' || fam === 'purple' || fam === 'magenta') && L > 0.70 && C < 42) fam = 'lavender';
  else if (fam === 'blue' && h >= 232 && L > 0.78 && C < 30) fam = 'lavender';
  else if (fam === 'red' && (h >= 338 || h <= 12) && L > 0.58 && C < 56) fam = 'pink';
  else if (fam === 'magenta' && ((h >= 320 && L > 0.55) || (L > 0.62 && C < 55))) fam = 'pink';

  var light = null, sat = null;
  if ((L < 0.20 || (L < 0.42 && hl < 0.22)) && hl < 0.30) light = 'vdark';
  else if ((L < 0.38 || (L < 0.55 && hl < 0.38)) && hl < 0.45) light = 'dark';
  else if (L >= 0.85 && hl > 0.72) light = 'vlight';
  else if (L >= 0.70 && hl > 0.62) light = 'light';

  if (C < 18) sat = 'gray';
  else if (C > 70) sat = 'vivid';

  // Washed out and light reads as "pale"; the chroma allowance widens as the
  // colour nears white, where even a little chroma still looks washed out.
  if (L > 0.78 && C < 18 + Math.max(0, L - 0.78) * 60) { light = 'pale'; sat = null; }

  // "Vivid" only means something at a hue's own natural lightness.
  if (sat === 'vivid' && light) sat = null;

  // Families whose names already carry a lightness or a muting of their own.
  if (fam === 'beige' && (light === 'light' || light === 'vlight')) light = null;
  if (fam === 'beige') sat = null;
  if (fam === 'lavender') { light = null; sat = null; }
  if (fam === 'pink' && (light === 'light' || light === 'vlight')) light = null;

  var f = FAM[fam];
  var lm = light ? LMOD[light] : null, sm = sat ? SMOD[sat] : null;
  var en = [lm && lm.en, sm && sm.en, f.en].filter(Boolean).join(' ');
  var fr = [f.fr, sm && sm.fr, lm && lm.fr].filter(Boolean).join(' ');
  return { en: cap(en), fr: cap(fr) };
}

/* ------------------------------------------------------------------ *
 * 4. Interface strings
 * ------------------------------------------------------------------ */

var I18N = {
  en: {
    install: 'Install', hint: 'Touch and drag on the image to read a colour',
    retry: 'Try again', frozen: 'Frozen', freeze: 'Freeze', unfreeze: 'Live',
    torch: 'Torch', flip: 'Flip', photo: 'Photo', camera: 'Camera', save: 'Save',
    samplearea: 'Sample area', notaken: '—',
    exactname: 'Exact colour name', exactsub: 'nearest catalogued colour',
    vername: 'Everyday name', versub: 'how people would describe it',
    copyhex: 'Copy HEX', copyall: 'Copy all', saved: 'Saved colours', clear: 'Clear',
    histempty: 'Nothing saved yet — tap + to keep a colour.',
    footer: 'Everything runs in your browser. No photo, frame or colour ever leaves your device.',
    backlink: '← More microapps',
    starting: 'Starting the camera…', startingMsg: 'Allow camera access when your browser asks.',
    denied: 'Camera access refused', deniedMsg: 'Allow the camera in your browser settings, or load a photo instead with the Photo button.',
    nocam: 'No camera found', nocamMsg: 'Load a photo instead with the Photo button.',
    insecure: 'Camera needs a secure page', insecureMsg: 'Open this app over HTTPS to use the camera. You can still load a photo with the Photo button.',
    camfail: 'Camera unavailable', camfailMsg: 'Another app may be using it. Try again, or load a photo with the Photo button.',
    photomode: 'Photo loaded — touch it to read colours',
    copied: 'Copied to clipboard', copyfail: 'Could not copy',
    savedtoast: 'Colour saved', dupe: 'Already saved',
    alsoclose: 'Also close:', matchref: 'reference',
    dE: ['spot on', 'very close', 'close', 'approximate', 'distant'],
    pickfirst: 'Pick a colour first'
  },
  fr: {
    install: 'Installer', hint: "Touchez l'image et glissez pour lire une couleur",
    retry: 'Réessayer', frozen: 'Figé', freeze: 'Figer', unfreeze: 'Direct',
    torch: 'Lampe', flip: 'Pivoter', photo: 'Photo', camera: 'Caméra', save: 'Garder',
    samplearea: 'Zone analysée', notaken: '—',
    exactname: 'Nom exact de la couleur', exactsub: 'couleur répertoriée la plus proche',
    vername: 'Nom courant', versub: 'comme on la décrirait tous les jours',
    copyhex: 'Copier HEX', copyall: 'Tout copier', saved: 'Couleurs gardées', clear: 'Vider',
    histempty: 'Rien de gardé pour l’instant — touchez + pour conserver une couleur.',
    footer: 'Tout se passe dans votre navigateur. Aucune photo, image ni couleur ne quitte votre appareil.',
    backlink: '← Autres microapps',
    starting: 'Démarrage de la caméra…', startingMsg: "Autorisez l'accès à la caméra lorsque le navigateur le demande.",
    denied: 'Accès à la caméra refusé', deniedMsg: "Autorisez la caméra dans les réglages du navigateur, ou chargez une photo avec le bouton Photo.",
    nocam: 'Aucune caméra détectée', nocamMsg: 'Chargez plutôt une photo avec le bouton Photo.',
    insecure: 'La caméra exige une page sécurisée', insecureMsg: "Ouvrez l'app en HTTPS pour utiliser la caméra. Vous pouvez tout de même charger une photo avec le bouton Photo.",
    camfail: 'Caméra indisponible', camfailMsg: "Une autre app l'utilise peut-être. Réessayez, ou chargez une photo avec le bouton Photo.",
    photomode: 'Photo chargée — touchez-la pour lire les couleurs',
    copied: 'Copié dans le presse-papiers', copyfail: 'Copie impossible',
    savedtoast: 'Couleur gardée', dupe: 'Déjà gardée',
    alsoclose: 'Aussi proches :', matchref: 'référence',
    dE: ['identique', 'très proche', 'proche', 'approximatif', 'éloigné'],
    pickfirst: 'Choisissez d’abord une couleur'
  }
};

var lang = localStorage.getItem('chromacam.lang');
if (lang !== 'en' && lang !== 'fr') {
  lang = /^fr/i.test(navigator.language || '') ? 'fr' : 'en';
}
function t(k) { return I18N[lang][k]; }

/* ------------------------------------------------------------------ *
 * 5. Elements and state
 * ------------------------------------------------------------------ */

var $ = function (id) { return document.getElementById(id); };
var stagewrap = $('stagewrap'), stage = $('stage'), overlay = $('overlay');
var sctx = stage.getContext('2d', { willReadFrequently: true });
var octx = overlay.getContext('2d');
var loupe = $('loupe'), loupecv = $('loupecv'), lctx = loupecv.getContext('2d');
var video = $('video'), fileinput = $('fileinput');

var DPR = 1;
var mode = 'camera';        // 'camera' | 'photo'
var live = false;           // is the stage being refreshed from the video?
var src = null;             // element currently drawn to the stage
var srcW = 0, srcH = 0;
var fit = 'cover';          // video fills the stage; a photo is shown whole
var drawRect = { x: 0, y: 0, w: 0, h: 0 };
var pick = null;            // {x, y} in stage pixels
var dragging = false;
var current = null;         // {r, g, b}
var sampleRadius = +(localStorage.getItem('chromacam.radius') || 12);
var stream = null, track = null, facing = 'environment', torchOn = false;
var snap = document.createElement('canvas');
var photo = document.createElement('canvas');

/* ------------------------------------------------------------------ *
 * 6. Stage rendering
 * ------------------------------------------------------------------ */

function resize() {
  var r = stagewrap.getBoundingClientRect();
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  var w = Math.max(1, Math.round(r.width * DPR)), h = Math.max(1, Math.round(r.height * DPR));
  if (stage.width === w && stage.height === h) return;
  stage.width = overlay.width = w;
  stage.height = overlay.height = h;
  pick = null;
  drawFrame();
  drawOverlay();
}

function computeDrawRect() {
  var cw = stage.width, ch = stage.height;
  if (!srcW || !srcH) { drawRect = { x: 0, y: 0, w: cw, h: ch }; return; }
  var s = fit === 'cover' ? Math.max(cw / srcW, ch / srcH) : Math.min(cw / srcW, ch / srcH);
  var w = srcW * s, h = srcH * s;
  drawRect = { x: (cw - w) / 2, y: (ch - h) / 2, w: w, h: h };
}

function drawFrame() {
  sctx.fillStyle = '#000';
  sctx.fillRect(0, 0, stage.width, stage.height);
  if (!src || !srcW || !srcH) return;
  computeDrawRect();
  try { sctx.drawImage(src, drawRect.x, drawRect.y, drawRect.w, drawRect.h); } catch (e) {}
}

function drawOverlay() {
  octx.clearRect(0, 0, overlay.width, overlay.height);
  if (!pick) return;
  var r = Math.max(3, sampleRadius * DPR);
  var u = DPR;

  // Target: a wide outer ring with four ticks, plus the actual sampling disc.
  var outer = r + 16 * u;
  octx.lineWidth = 3 * u;
  octx.strokeStyle = 'rgba(0,0,0,.55)';
  ring(pick.x, pick.y, outer);
  octx.lineWidth = 1.5 * u;
  octx.strokeStyle = 'rgba(255,255,255,.85)';
  ring(pick.x, pick.y, outer);

  var tick = 9 * u;
  octx.beginPath();
  octx.moveTo(pick.x - outer - tick, pick.y); octx.lineTo(pick.x - outer + tick * 0.35, pick.y);
  octx.moveTo(pick.x + outer - tick * 0.35, pick.y); octx.lineTo(pick.x + outer + tick, pick.y);
  octx.moveTo(pick.x, pick.y - outer - tick); octx.lineTo(pick.x, pick.y - outer + tick * 0.35);
  octx.moveTo(pick.x, pick.y + outer - tick * 0.35); octx.lineTo(pick.x, pick.y + outer + tick);
  octx.lineWidth = 3 * u; octx.strokeStyle = 'rgba(0,0,0,.55)'; octx.stroke();
  octx.lineWidth = 1.5 * u; octx.strokeStyle = 'rgba(255,255,255,.85)'; octx.stroke();

  octx.lineWidth = 3.5 * u;
  octx.strokeStyle = 'rgba(0,0,0,.6)';
  ring(pick.x, pick.y, r);
  octx.lineWidth = 2 * u;
  octx.strokeStyle = current ? hexOf(current.r, current.g, current.b) : '#fff';
  ring(pick.x, pick.y, r);
  octx.lineWidth = 1 * u;
  octx.strokeStyle = 'rgba(255,255,255,.9)';
  ring(pick.x, pick.y, r + 2 * u);

  function ring(x, y, rad) {
    octx.beginPath(); octx.arc(x, y, rad, 0, Math.PI * 2); octx.stroke();
  }
}

var LOUPE_ZOOM = 7;
function drawLoupe() {
  var size = loupecv.width;
  lctx.save();
  lctx.beginPath(); lctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); lctx.clip();
  lctx.fillStyle = '#000'; lctx.fillRect(0, 0, size, size);
  lctx.imageSmoothingEnabled = false;
  var s = size / LOUPE_ZOOM;
  lctx.drawImage(stage, pick.x - s / 2, pick.y - s / 2, s, s, 0, 0, size, size);
  var rr = Math.max(3, sampleRadius * DPR) * LOUPE_ZOOM;
  lctx.lineWidth = 3; lctx.strokeStyle = 'rgba(0,0,0,.6)';
  lctx.beginPath(); lctx.arc(size / 2, size / 2, rr, 0, Math.PI * 2); lctx.stroke();
  lctx.lineWidth = 1.5; lctx.strokeStyle = 'rgba(255,255,255,.9)';
  lctx.beginPath(); lctx.arc(size / 2, size / 2, rr, 0, Math.PI * 2); lctx.stroke();
  lctx.restore();
}

function loop() {
  if (live && video.readyState >= 2) {
    srcW = video.videoWidth; srcH = video.videoHeight;
    drawFrame();
    if (dragging && pick) { sampleNow(); drawOverlay(); drawLoupe(); }
  }
  requestAnimationFrame(loop);
}

/* ------------------------------------------------------------------ *
 * 7. Sampling
 * ------------------------------------------------------------------ */

function sampleNow() {
  if (!pick) return;
  var r = Math.max(1, Math.round(sampleRadius * DPR));
  var cx = Math.round(pick.x), cy = Math.round(pick.y);
  var x0 = Math.max(0, cx - r), y0 = Math.max(0, cy - r);
  var x1 = Math.min(stage.width, cx + r + 1), y1 = Math.min(stage.height, cy + r + 1);
  if (x1 <= x0 || y1 <= y0) return;

  var data;
  try { data = sctx.getImageData(x0, y0, x1 - x0, y1 - y0).data; }
  catch (e) { return; }

  // Average in linear light — averaging gamma-encoded bytes biases the result dark.
  var w = x1 - x0, lr = 0, lg = 0, lb = 0, n = 0, rr = r * r;
  for (var y = y0; y < y1; y++) {
    for (var x = x0; x < x1; x++) {
      var dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > rr) continue;
      var i = ((y - y0) * w + (x - x0)) * 4;
      lr += LIN[data[i]]; lg += LIN[data[i + 1]]; lb += LIN[data[i + 2]]; n++;
    }
  }
  if (!n) return;
  setCurrent(linToByte(lr / n), linToByte(lg / n), linToByte(lb / n));
}

function setCurrent(r, g, b) {
  current = { r: r, g: g, b: b };
  render();
}

/* ------------------------------------------------------------------ *
 * 8. Readout
 * ------------------------------------------------------------------ */

function dEBand(d) {
  return d < 1 ? 0 : d < 2.5 ? 1 : d < 5 ? 2 : d < 11 ? 3 : 4;
}
var BAND_CLASS = ['dE-exact', 'dE-close', 'dE-close', 'dE-near', 'dE-far'];

function render() {
  if (!current) return;
  var r = current.r, g = current.g, b = current.b;
  var hex = hexOf(r, g, b);
  var hsl = rgbToHsl(r, g, b);
  var lab = rgbToLab(r, g, b);

  document.documentElement.style.setProperty('--pick', hex);
  document.documentElement.style.setProperty('--pick-ink', readableInk(r, g, b));
  $('swatchtxt').textContent = hex;
  $('cRGB').textContent = r + ', ' + g + ', ' + b;
  $('cHEX').textContent = hex;
  $('cHSL').textContent = Math.round(hsl[0]) + '°, ' + Math.round(hsl[1] * 100) + '%, ' +
                          Math.round(hsl[2] * 100) + '%';

  var near = nearestNames(lab);
  var top = near[0];
  $('exEN').textContent = top.c.en;
  $('exFR').textContent = top.c.fr;
  $('exchip').style.background = top.c.hex;
  $('exchip').title = top.c.hex;

  var band = dEBand(top.d);
  $('matchmeta').innerHTML =
    '<span class="dEbadge ' + BAND_CLASS[band] + '">ΔE ' + top.d.toFixed(1) + '</span>' +
    '<span>' + t('dE')[band] + '</span>' +
    '<span>· ' + t('matchref') + ' ' + top.c.hex + '</span>';

  $('alsoclose').innerHTML = t('alsoclose') + ' ' + near.slice(1).map(function (m) {
    return '<i>' + (lang === 'fr' ? m.c.fr : m.c.en) + '</i> (ΔE ' + m.d.toFixed(1) + ')';
  }).join(', ');

  var v = vernacular(r, g, b);
  $('vnEN').textContent = v.en;
  $('vnFR').textContent = v.fr;
  $('btnSave').disabled = false;
}

/* ------------------------------------------------------------------ *
 * 9. Pointer handling
 * ------------------------------------------------------------------ */

function toStage(ev) {
  var rect = stage.getBoundingClientRect();
  var x = (ev.clientX - rect.left) * (stage.width / rect.width);
  var y = (ev.clientY - rect.top) * (stage.height / rect.height);
  // Keep the reticle inside the actual picture, not the letterbox around it.
  var pad = 1;
  x = Math.min(Math.max(x, drawRect.x + pad), drawRect.x + drawRect.w - pad);
  y = Math.min(Math.max(y, drawRect.y + pad), drawRect.y + drawRect.h - pad);
  return { x: Math.min(Math.max(x, 0), stage.width - 1), y: Math.min(Math.max(y, 0), stage.height - 1) };
}

stagewrap.addEventListener('pointerdown', function (ev) {
  if (!src) return;
  ev.preventDefault();
  stagewrap.setPointerCapture(ev.pointerId);
  dragging = true;
  pick = toStage(ev);
  $('hint').classList.add('hide');
  loupe.classList.add('on');
  sampleNow(); updateLoupeSide(); drawOverlay(); drawLoupe();
});
stagewrap.addEventListener('pointermove', function (ev) {
  if (!dragging) return;
  ev.preventDefault();
  pick = toStage(ev);
  sampleNow(); updateLoupeSide(); drawOverlay(); drawLoupe();
});
function endDrag() {
  if (!dragging) return;
  dragging = false;
  loupe.classList.remove('on');   // the reading stays locked on the last sample
  drawOverlay();
}
stagewrap.addEventListener('pointerup', endDrag);
stagewrap.addEventListener('pointercancel', endDrag);
stagewrap.addEventListener('contextmenu', function (e) { e.preventDefault(); });

function updateLoupeSide() {
  loupe.classList.toggle('right', pick.x < stage.width / 2);
  loupe.style.borderColor = current ? hexOf(current.r, current.g, current.b) : '#fff';
}

/* ------------------------------------------------------------------ *
 * 10. Camera
 * ------------------------------------------------------------------ */

function camState(on, title, msg, retry) {
  $('camstate').classList.toggle('on', on);
  if (!on) return;
  $('cstitle').textContent = title;
  $('csmsg').textContent = msg || '';
  $('csretry').hidden = !retry;
}

function stopStream() {
  if (stream) { stream.getTracks().forEach(function (tk) { tk.stop(); }); }
  stream = null; track = null; torchOn = false;
  $('btnTorch').classList.remove('active');
  $('btnTorch').disabled = true;
}

function startCamera() {
  if (!window.isSecureContext) {
    camState(true, t('insecure'), t('insecureMsg'), false);
    return Promise.resolve();
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    camState(true, t('nocam'), t('nocamMsg'), false);
    return Promise.resolve();
  }
  camState(true, t('starting'), t('startingMsg'), false);
  stopStream();
  return navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    audio: false
  }).then(function (s) {
    stream = s;
    track = s.getVideoTracks()[0];
    video.srcObject = s;
    return video.play();
  }).then(function () {
    mode = 'camera'; fit = 'cover'; live = true; src = video;
    camState(false);
    setPhotoButton(false);
    setFreezeButton(false);
    detectTorch();
  }).catch(function (err) {
    var n = err && err.name;
    if (n === 'NotAllowedError' || n === 'SecurityError') camState(true, t('denied'), t('deniedMsg'), true);
    else if (n === 'NotFoundError' || n === 'OverconstrainedError') camState(true, t('nocam'), t('nocamMsg'), true);
    else camState(true, t('camfail'), t('camfailMsg'), true);
    live = false;
  });
}

function detectTorch() {
  var ok = false;
  try {
    var caps = track && track.getCapabilities ? track.getCapabilities() : null;
    ok = !!(caps && caps.torch);
  } catch (e) {}
  $('btnTorch').disabled = !ok;
}

/* ------------------------------------------------------------------ *
 * 11. Controls
 * ------------------------------------------------------------------ */

function setFreezeButton(frozen) {
  $('btnFreeze').classList.toggle('active', frozen);
  $('btnFreeze').querySelector('span:last-child').textContent = frozen ? t('unfreeze') : t('freeze');
  $('frozenbadge').classList.toggle('on', frozen);
}
function setPhotoButton(isPhoto) {
  $('btnPhoto').classList.toggle('active', isPhoto);
  $('btnPhoto').querySelector('span:last-child').textContent = isPhoto ? t('camera') : t('photo');
}

$('btnFreeze').addEventListener('click', function () {
  if (mode === 'photo') { startCamera(); return; }
  if (live) {
    if (!video.videoWidth) return;
    snap.width = video.videoWidth; snap.height = video.videoHeight;
    snap.getContext('2d').drawImage(video, 0, 0);
    src = snap; srcW = snap.width; srcH = snap.height;
    live = false;
    drawFrame(); drawOverlay();
    setFreezeButton(true);
  } else {
    src = video; live = true;
    setFreezeButton(false);
  }
});

$('btnTorch').addEventListener('click', function () {
  if (!track) return;
  torchOn = !torchOn;
  track.applyConstraints({ advanced: [{ torch: torchOn }] }).then(function () {
    $('btnTorch').classList.toggle('active', torchOn);
  }).catch(function () {
    torchOn = false;
    $('btnTorch').disabled = true;
    $('btnTorch').classList.remove('active');
  });
});

$('btnFlip').addEventListener('click', function () {
  facing = facing === 'environment' ? 'user' : 'environment';
  startCamera();
});

$('btnPhoto').addEventListener('click', function () {
  if (mode === 'photo') { startCamera(); return; }
  fileinput.click();
});

fileinput.addEventListener('change', function () {
  var f = fileinput.files && fileinput.files[0];
  if (!f) return;
  var url = URL.createObjectURL(f);
  var img = new Image();
  img.onload = function () {
    stopStream();
    photo.width = img.naturalWidth; photo.height = img.naturalHeight;
    photo.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    mode = 'photo'; live = false; fit = 'contain';
    src = photo; srcW = photo.width; srcH = photo.height;
    pick = null; camState(false);
    setPhotoButton(true); setFreezeButton(false);
    $('hint').textContent = t('photomode');
    $('hint').classList.remove('hide');
    drawFrame(); drawOverlay();
  };
  img.onerror = function () { URL.revokeObjectURL(url); toast(t('camfail')); };
  img.src = url;
  fileinput.value = '';
});

var sizerange = $('sizerange');
sizerange.value = sampleRadius;
$('sizeval').textContent = sampleRadius + ' px';
sizerange.addEventListener('input', function () {
  sampleRadius = +sizerange.value;
  $('sizeval').textContent = sampleRadius + ' px';
  localStorage.setItem('chromacam.radius', String(sampleRadius));
  if (pick) { sampleNow(); drawOverlay(); if (dragging) drawLoupe(); }
});

/* ------------------------------------------------------------------ *
 * 12. Copy, toast, history
 * ------------------------------------------------------------------ */

var toastTimer = null;
function toast(msg) {
  var el = $('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('on'); }, 1800);
}

function copy(text) {
  function fallback() {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    toast(ok ? t('copied') : t('copyfail'));
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { toast(t('copied')); }, fallback);
  } else fallback();
}

$('btnCopyHex').addEventListener('click', function () {
  if (!current) { toast(t('pickfirst')); return; }
  copy(hexOf(current.r, current.g, current.b));
});

$('btnCopyAll').addEventListener('click', function () {
  if (!current) { toast(t('pickfirst')); return; }
  var r = current.r, g = current.g, b = current.b;
  var hsl = rgbToHsl(r, g, b);
  var near = nearestNames(rgbToLab(r, g, b))[0];
  var v = vernacular(r, g, b);
  copy([
    hexOf(r, g, b),
    'rgb(' + r + ', ' + g + ', ' + b + ')',
    'hsl(' + Math.round(hsl[0]) + ', ' + Math.round(hsl[1] * 100) + '%, ' + Math.round(hsl[2] * 100) + '%)',
    'EN  ' + near.c.en + ' / ' + v.en,
    'FR  ' + near.c.fr + ' / ' + v.fr,
    'ΔE ' + near.d.toFixed(1) + ' vs ' + near.c.hex
  ].join('\n'));
});

var HKEY = 'chromacam.history';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch (e) { return []; }
}
function saveHistory(h) {
  try { localStorage.setItem(HKEY, JSON.stringify(h.slice(0, 40))); } catch (e) {}
}
function renderHistory() {
  var h = loadHistory(), list = $('histlist');
  list.innerHTML = '';
  $('histempty').hidden = h.length > 0;
  $('btnClearHist').hidden = h.length === 0;
  h.forEach(function (hex, idx) {
    var rgb = parseHex(hex);
    var el = document.createElement('div');
    el.className = 'hchip';
    el.title = hex + ' — ' + (lang === 'fr' ? vernacular(rgb[0], rgb[1], rgb[2]).fr
                                            : vernacular(rgb[0], rgb[1], rgb[2]).en);
    el.innerHTML = '<div class="sw" style="background:' + hex + '"></div>' +
                   '<div class="hx">' + hex.slice(1) + '</div>' +
                   '<span class="del" data-del="' + idx + '">×</span>';
    el.addEventListener('click', function (ev) {
      if (ev.target.hasAttribute('data-del')) {
        var cur = loadHistory(); cur.splice(idx, 1); saveHistory(cur); renderHistory();
        return;
      }
      setCurrent(rgb[0], rgb[1], rgb[2]);
    });
    list.appendChild(el);
  });
}
$('btnSave').addEventListener('click', function () {
  if (!current) { toast(t('pickfirst')); return; }
  var hex = hexOf(current.r, current.g, current.b);
  var h = loadHistory();
  if (h[0] === hex) { toast(t('dupe')); return; }
  h = [hex].concat(h.filter(function (x) { return x !== hex; }));
  saveHistory(h); renderHistory(); toast(t('savedtoast'));
});
$('btnClearHist').addEventListener('click', function () {
  saveHistory([]); renderHistory();
});

/* ------------------------------------------------------------------ *
 * 13. Language
 * ------------------------------------------------------------------ */

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var v = I18N[lang][el.getAttribute('data-i18n')];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('#langtoggle button').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  setFreezeButton($('btnFreeze').classList.contains('active'));
  setPhotoButton(mode === 'photo');
  if (mode === 'photo') $('hint').textContent = t('photomode');
  $('sizeval').textContent = sampleRadius + ' px';
  if (current) render();
  renderHistory();
}
document.querySelectorAll('#langtoggle button').forEach(function (b) {
  b.addEventListener('click', function () {
    lang = b.dataset.lang;
    localStorage.setItem('chromacam.lang', lang);
    applyLang();
  });
});

/* ------------------------------------------------------------------ *
 * 14. PWA plumbing
 * ------------------------------------------------------------------ */

var deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  deferredPrompt = e;
  $('installbtn').hidden = false;
});
$('installbtn').addEventListener('click', function () {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function () {
    deferredPrompt = null;
    $('installbtn').hidden = true;
  });
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  });
}

/* Exposed so the offline harness in src_material/chromacam/ can exercise the
 * colour maths and the naming tables without driving the interface. */
window.ChromaCam = {
  rgbToLab: rgbToLab, rgbToHsl: rgbToHsl, ciede2000: ciede2000,
  nearestNames: nearestNames, vernacular: vernacular,
  hexOf: hexOf, parseHex: parseHex, catalog: CATALOG,
  setColor: setCurrent, getColor: function () { return current; }
};

/* ------------------------------------------------------------------ *
 * 15. Boot
 * ------------------------------------------------------------------ */

$('csretry').addEventListener('click', startCamera);
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', function () { setTimeout(resize, 250); });
document.addEventListener('visibilitychange', function () {
  // Some mobile browsers suspend the track when backgrounded; nudge it back.
  if (!document.hidden && mode === 'camera' && live && video.paused) video.play().catch(function () {});
});

applyLang();
renderHistory();
$('btnSave').disabled = true;
resize();
requestAnimationFrame(loop);
startCamera();

})();
