/* Grafiki generowane w kodzie (SVG): kryształy minerałów, nocna scena z domem, rzut mieszkania,
   tekstury kamieni. Jeśli w public/img/ pojawią się zdjęcia, aplikacja użyje ich zamiast tych grafik. */
window.ART = (function () {
  'use strict';

  // ---------- minerały (poziomy Jany) ----------
  const PALETTES = {
    quartz: { dark: '#7d8896', mid: '#cfd8e3', light: '#ffffff', glow: 'rgba(190,215,255,.38)' },
    fluorite: { dark: '#14523c', mid: '#36b583', light: '#bff7dd', glow: 'rgba(54,181,131,.4)' },
    amethyst: { dark: '#3d2168', mid: '#9566d6', light: '#e6d6ff', glow: 'rgba(149,102,214,.45)' },
    ruby: { dark: '#4f0817', mid: '#c41d43', light: '#ffa3b6', glow: 'rgba(196,29,67,.42)' }
  };

  let uid = 0;

  // Jeden kryształ: sześciokątny słup z ostrym wierzchołkiem, trzy widoczne ściany.
  function prism(cx, base, w, hgt, angle, pal, id, opacity) {
    const t = -hgt, apex = t - w * 0.95;
    const L = -w / 2, ML = -w / 6, MR = w / 6, R = w / 2;
    const faces = [
      [`${L},0 ${ML},${w * 0.06} ${ML},${t + w * 0.06} ${L},${t}`, `url(#${id}d)`],
      [`${ML},${w * 0.06} ${MR},${w * 0.06} ${MR},${t + w * 0.06} ${ML},${t + w * 0.06}`, `url(#${id}m)`],
      [`${MR},${w * 0.06} ${R},0 ${R},${t} ${MR},${t + w * 0.06}`, `url(#${id}l)`],
      [`${L},${t} ${ML},${t + w * 0.06} 0,${apex}`, pal.dark],
      [`${ML},${t + w * 0.06} ${MR},${t + w * 0.06} 0,${apex}`, pal.light],
      [`${MR},${t + w * 0.06} ${R},${t} 0,${apex}`, pal.mid]
    ];
    return `<g transform="translate(${cx} ${base}) rotate(${angle})" opacity="${opacity}">` +
      faces.map(([p, f]) => `<polygon points="${p}" fill="${f}" stroke="rgba(255,255,255,.28)" stroke-width="0.8" stroke-linejoin="round"/>`).join('') +
      `<line x1="${MR * 0.4}" y1="${t * 0.15}" x2="${MR * 0.4}" y2="${t * 0.85}" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-linecap="round"/>` +
      `</g>`;
  }

  function crystal(key, opts) {
    const pal = PALETTES[key] || PALETTES.quartz;
    const id = 'cr' + (++uid);
    const small = opts && opts.small;
    const parts = [
      // [x, w, h, kąt, krycie] – od tyłu do przodu
      [160, 34, 120, -24, 0.75], [250, 30, 110, 22, 0.75], [205, 44, 190, -4, 0.95],
      [140, 38, 135, -38, 0.9], [270, 40, 140, 30, 0.92], [185, 48, 150, -14, 1], [232, 46, 165, 12, 1]
    ];
    const body = parts.map(([x, w, hh, a, o]) => prism(x, 330, w, hh, a, pal, id, o)).join('');
    return `<svg class="crystal" viewBox="40 60 320 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="kryształ">
      <defs>
        <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.mid}"/><stop offset="1" stop-color="${pal.dark}"/></linearGradient>
        <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.light}"/><stop offset=".6" stop-color="${pal.mid}"/><stop offset="1" stop-color="${pal.dark}"/></linearGradient>
        <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pal.light}"/><stop offset="1" stop-color="${pal.mid}"/></linearGradient>
        <radialGradient id="${id}g"><stop offset="0" stop-color="${pal.glow}"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
        <filter id="${id}r"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .1  0 0 0 0 .11  0 0 0 .9 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      </defs>
      ${small ? '' : `<circle cx="205" cy="230" r="150" fill="url(#${id}g)"/>`}
      ${body}
      <path d="M70 336 Q110 300 160 318 Q205 296 250 316 Q300 300 340 336 L345 360 L60 360 Z" fill="#1b1a1c"/>
      <path d="M70 336 Q110 300 160 318 Q205 296 250 316 Q300 300 340 336 L345 360 L60 360 Z" fill="#555" filter="url(#${id}r)"/>
    </svg>`;
  }

  // ---------- nocna scena z domem (Dominik) ----------
  // Dwie warstwy w tej samej skali: tło (niebo, drzewa) i dom – napis wstawiamy pomiędzy nie.
  function houseBack() {
    const stars = [[120, 80], [340, 140], [520, 60], [760, 120], [980, 50], [1180, 150], [1420, 90], [1530, 200], [640, 210], [260, 260]]
      .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.2 : 1.8}" fill="#fff" opacity="${0.25 + (i % 4) * 0.12}"/>`).join('');
    const treeL = [[60, 470, 150], [170, 420, 170], [290, 500, 120], [20, 380, 120], [120, 330, 110], [230, 360, 100]]
      .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#0a0e14' : '#0c1118'}"/>`).join('');
    const treeR = [[1480, 430, 170], [1590, 360, 160], [1360, 500, 120], [1530, 300, 120], [1410, 340, 100]]
      .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#0a0e14' : '#0c1118'}"/>`).join('');
    return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060a"/><stop offset=".55" stop-color="#141c28"/><stop offset="1" stop-color="#1f2733"/></linearGradient>
        <radialGradient id="moon" cx=".72" cy=".16" r=".3"><stop offset="0" stop-color="rgba(200,215,255,.22)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)"/><rect width="1600" height="900" fill="url(#moon)"/>
      ${stars}
      <path d="M0 560 Q120 500 240 540 T480 520 T760 540 T1040 515 T1320 545 T1600 520 V900 H0 Z" fill="#090c11"/>
      ${treeL}${treeR}
      <rect y="640" width="1600" height="260" fill="#07090c"/>
    </svg>`;
  }

  function houseFront() {
    const panes = [];
    for (let x = 440; x < 900; x += 76) panes.push(`<rect x="${x}" y="500" width="72" height="190" fill="url(#win)"/>`);
    const slats = [];
    for (let x = 936; x < 1236; x += 14) slats.push(`<rect x="${x}" y="492" width="7" height="208" fill="url(#wood)"/>`);
    const glass = panes.join('');
    return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd59a"/><stop offset=".45" stop-color="#d98a3c"/><stop offset="1" stop-color="#4a2309"/></linearGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4224"/><stop offset=".7" stop-color="#b9783d"/><stop offset="1" stop-color="#f0b36a"/></linearGradient>
        <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e2f39"/><stop offset="1" stop-color="#050f13"/></linearGradient>
        <radialGradient id="up" cx=".5" cy="1" r=".6"><stop offset="0" stop-color="rgba(255,190,110,.55)"/><stop offset="1" stop-color="rgba(255,190,110,0)"/></radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="4"/></filter>
        <clipPath id="poolclip"><rect x="250" y="722" width="1100" height="138"/></clipPath>
      </defs>
      <rect x="200" y="560" width="220" height="140" fill="#161618"/>
      <rect x="180" y="545" width="260" height="20" fill="#2a2a2d"/>
      <rect x="380" y="470" width="870" height="230" fill="#1b1b1d"/>
      ${glass}
      <g opacity=".55"><rect x="520" y="620" width="120" height="40" fill="#2b1608"/><rect x="700" y="600" width="60" height="90" fill="#2b1608"/></g>
      <rect x="900" y="480" width="30" height="220" fill="#0e0e0f"/>
      <rect x="930" y="488" width="310" height="212" fill="#2a170b"/>
      ${slats.join('')}
      <rect x="930" y="600" width="310" height="100" fill="url(#up)"/>
      <rect x="330" y="438" width="1000" height="36" fill="#2c2c30"/>
      <rect x="330" y="438" width="1000" height="3" fill="#4a4a50"/>
      <rect x="360" y="473" width="940" height="4" fill="#ffcf8a" opacity=".5"/>
      <rect x="150" y="700" width="1300" height="22" fill="#222225"/>
      <rect x="250" y="722" width="1100" height="138" fill="url(#pool)"/>
      <g clip-path="url(#poolclip)" opacity=".38" filter="url(#blur)" transform="translate(0 1422) scale(1 -1)">${glass}<rect x="930" y="488" width="310" height="212" fill="#b9783d" opacity=".5"/></g>
      <g stroke="rgba(255,255,255,.18)" stroke-width="2"><line x1="300" y1="760" x2="620" y2="760"/><line x1="760" y1="800" x2="1180" y2="800"/></g>
      <rect y="860" width="1600" height="40" fill="#050607"/>
    </svg>`;
  }

  function scene(word, cls) {
    return `<div class="scene ${cls || ''}" data-scene>
      <div class="scene-layer scene-back">${houseBack()}</div>
      <div class="scene-word" aria-hidden="true">${word}</div>
      <div class="scene-layer scene-front">${houseFront()}</div>
    </div>`;
  }

  // ---------- rzut mieszkania ----------
  function blueprint() {
    return `<svg class="blueprint" viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rzut mieszkania">
      <g fill="none" stroke="currentColor" stroke-linecap="square">
        <path d="M40 40 H560 V340 H40 Z" stroke-width="6"/>
        <path d="M250 40 V170 M250 230 V340 M40 200 H160 M210 200 H250 M400 40 V120 M400 170 V250 M400 250 H560 M250 120 H330 M370 120 H400" stroke-width="3.5"/>
        <path d="M160 200 A50 50 0 0 1 210 150 M330 120 A40 40 0 0 0 370 80 M250 170 A60 60 0 0 1 310 230" stroke-width="1" stroke-dasharray="3 3"/>
        <path d="M100 40 H200 M440 340 H530 M560 270 V320 M40 80 V150" stroke-width="10" stroke="var(--bp-bg, #fff)"/>
        <path d="M100 37 H200 M100 43 H200 M440 337 H530 M440 343 H530 M557 270 V320 M563 270 V320 M37 80 V150 M43 80 V150" stroke-width="1"/>
        <g stroke-width="1" opacity=".75">
          <rect x="70" y="240" width="110" height="70"/><rect x="290" y="260" width="80" height="50" rx="4"/>
          <path d="M420 60 h110 v40 h-110z M440 280 h90 v40 h-90z"/>
          <circle cx="330" cy="285" r="14"/><path d="M280 60 v40 M300 60 v40 M320 60 v40 M340 60 v40 M360 60 v40"/>
        </g>
        <g stroke-width=".8" opacity=".6"><path d="M40 360 H560 M40 354 V366 M250 354 V366 M560 354 V366 M20 40 V340 M14 40 H26 M14 340 H26"/></g>
      </g>
      <g fill="currentColor" font-family="Manrope, sans-serif" font-size="11" letter-spacing="1.5" opacity=".85">
        <text x="95" y="120">SYPIALNIA</text><text x="95" y="135" font-size="9">14,2 m²</text>
        <text x="300" y="200">SALON</text><text x="300" y="215" font-size="9">32,5 m²</text>
        <text x="440" y="200">KUCHNIA</text><text x="440" y="215" font-size="9">11,8 m²</text>
        <text x="85" y="232" font-size="9">ŁAZIENKA</text>
        <text x="130" y="374" font-size="9">8,40 m</text><text x="390" y="374" font-size="9">12,20 m</text>
      </g>
    </svg>`;
  }

  // ---------- tekstury kamieni (tła przycisków) ----------
  function hexRgb(hx) { const n = parseInt(hx.slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map(v => v.toFixed(3)); }
  function texture(base, layers) {
    const defs = layers.map((l, i) => {
      const [r, g, b] = hexRgb(l.c);
      return `<filter id="f${i}" x="0" y="0" width="100%" height="100%"><feTurbulence type="${l.type || 'fractalNoise'}" baseFrequency="${l.f}" numOctaves="${l.o || 3}" seed="${l.s || 1}"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${l.k} 0 0 0 ${l.b}"/></filter>`;
    }).join('');
    const rects = layers.map((_, i) => `<rect width="100%" height="100%" filter="url(#f${i})"/>`).join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='160'><defs>${defs}</defs><rect width='100%' height='100%' fill='${base}'/>${rects}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  const TEXTURES = {
    agate: texture('#2b6a52', [
      { c: '#c9f0dc', f: '0.004 0.07', o: 2, s: 3, k: 3.2, b: -1.45 },
      { c: '#0e3a2c', f: '0.02', o: 4, s: 8, k: 2.4, b: -1.05 },
      { c: '#e8fff4', f: '0.003 0.12', o: 1, s: 12, k: 4, b: -2.6 }
    ]),
    amethyst: texture('#563489', [
      { c: '#e2cfff', f: '0.035 0.012', o: 3, s: 5, k: 2.8, b: -1.35 },
      { c: '#24104a', f: '0.06', o: 4, s: 2, k: 2.2, b: -0.95 }
    ]),
    granite: texture('#6f6a66', [
      { c: '#141312', f: '0.55', o: 2, s: 4, k: 3.2, b: -1.7 },
      { c: '#efe8e0', f: '0.45', o: 2, s: 9, k: 3.2, b: -1.85 },
      { c: '#b98f78', f: '0.3', o: 2, s: 11, k: 3, b: -1.75 }
    ]),
    concrete: texture('#2a2a2c', [
      { c: '#4a4a4f', f: '0.9', o: 2, s: 6, k: 2.5, b: -1.2 },
      { c: '#111112', f: '0.05', o: 3, s: 14, k: 1.8, b: -0.9 }
    ])
  };
  function applyTextures() {
    const r = document.documentElement.style;
    Object.keys(TEXTURES).forEach(k => r.setProperty('--tex-' + k, TEXTURES[k]));
  }

  // ---------- opcjonalne zdjęcia z public/img ----------
  const PHOTO = {};
  function probe(src) {
    if (src in PHOTO) return Promise.resolve(PHOTO[src]);
    return new Promise(res => {
      const im = new Image();
      im.onload = () => { PHOTO[src] = true; res(true); };
      im.onerror = () => { PHOTO[src] = false; res(false); };
      im.src = src;
    });
  }
  // Podmienia wygenerowane grafiki na zdjęcia, jeśli zostały wgrane.
  function upgradePhotos(root) {
    (root || document).querySelectorAll('[data-scene]').forEach(el => {
      probe('img/dominik-hero.jpg').then(ok => {
        if (!ok || el.classList.contains('has-photo')) return;
        el.insertAdjacentHTML('afterbegin', '<img class="scene-photo" src="img/dominik-hero.jpg" alt="">');
        el.classList.add('has-photo');
      });
    });
    (root || document).querySelectorAll('[data-mineral]').forEach(el => {
      const src = `img/mineral-${el.dataset.mineral}.png`;
      probe(src).then(ok => {
        if (!ok || el.classList.contains('has-photo')) return;
        el.innerHTML = `<img class="mineral-photo" src="${src}" alt="">`;
        el.classList.add('has-photo');
      });
    });
  }

  return { crystal, scene, blueprint, applyTextures, upgradePhotos, PALETTES };
})();
