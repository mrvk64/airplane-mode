// Airplane Mode: illustrated "photos", drawn as SVG from a scene name and a seed, so the app
// needs no images and no network. AM.art(scene, seed) returns a cached data: URI.
window.AM = window.AM || {};

(function () {
  const W = 400, H = 300;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  AM.rng = rng;
  AM.hash = function (s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  const f = n => Math.round(n * 10) / 10;
  const lin = (id, stops, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">` +
    stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('') + '</linearGradient>';
  const rad = (id, inner, outer) =>
    `<radialGradient id="${id}"><stop offset="0" stop-color="${inner}"/><stop offset="1" stop-color="${outer}" stop-opacity="0"/></radialGradient>`;
  const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;
  const circ = (x, y, r, fill, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
  const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${fill}" ${extra}/>`;
  const emo = (ch, x, y, size, extra = '') =>
    `<text x="${f(x)}" y="${f(y)}" font-size="${size}" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif" ${extra}>${ch}</text>`;

  function ridge(r, y0, amp, steps, fill) {
    const pts = [[0, H]];
    for (let i = 0; i <= steps; i++) {
      const x = (W / steps) * i;
      pts.push([x, y0 - r() * amp - (i % 2 ? amp * 0.4 : 0)]);
    }
    pts.push([W, H]);
    return poly(pts, fill);
  }

  function skyline(r, base, minH, maxH, fill, windows) {
    let out = '', x = -10;
    while (x < W) {
      const w = 22 + r() * 38, h = minH + r() * (maxH - minH);
      out += rect(x, base - h, w, h + 2, fill);
      if (windows) {
        for (let wy = base - h + 8; wy < base - 6; wy += 11) {
          for (let wx = x + 5; wx < x + w - 6; wx += 9) {
            if (r() < 0.38) out += rect(wx, wy, 4, 5, r() < 0.8 ? '#FFD98A' : '#9FD3FF', 'opacity="0.9"');
          }
        }
      }
      x += w + 2 + r() * 6;
    }
    return out;
  }

  function clouds(r, n, yMin, yMax, color, op) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const cx = r() * W, cy = yMin + r() * (yMax - yMin), s = 18 + r() * 30;
      out += `<g opacity="${op}">` + circ(cx, cy, s, color) + circ(cx + s * 0.9, cy + 4, s * 0.8, color) +
        circ(cx - s * 0.9, cy + 6, s * 0.7, color) + rect(cx - s * 1.5, cy + 4, s * 3.1, s * 0.75, color, `rx="${f(s * 0.35)}"`) + '</g>';
    }
    return out;
  }

  const SKIES = [
    ['#2B2D6E', '#C8507A', '#FF9A5A', '#FFD27A'],
    ['#1D3B6F', '#7D5BA6', '#F2767A', '#FFC07A'],
    ['#3A1F5C', '#B33F6B', '#F58B54', '#FBD38D']
  ];

  const scenes = {
    sunset(r) {
      const s = SKIES[Math.floor(r() * SKIES.length)];
      const sx = 120 + r() * 160;
      let o = '<defs>' + lin('sk', s) + lin('sea', ['#2E3A6E', '#141A3A']) + rad('glow', '#FFE2A8', '#FFE2A8') + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + circ(sx, 190, 120, 'url(#glow)', 'opacity="0.55"') + circ(sx, 192, 34, '#FFE7B3');
      o += rect(0, 196, W, 104, 'url(#sea)');
      for (let i = 0; i < 16; i++) {
        const y = 202 + i * 6 + r() * 3, w = 20 + r() * 70 - i * 2;
        o += rect(sx - w / 2 + (r() - 0.5) * 30, y, Math.max(w, 8), 2, '#FFD9A0', `opacity="${f(0.75 - i * 0.04)}"`);
      }
      for (let i = 0; i < 3; i++) {
        const bx = 60 + r() * 280, by = 50 + r() * 70;
        o += `<path d="M${f(bx - 8)} ${f(by)} q4 -5 8 0 q4 -5 8 0" stroke="#2A1F3D" stroke-width="2" fill="none"/>`;
      }
      return o;
    },
    city(r) {
      let o = '<defs>' + lin('sk', ['#0B1030', '#1E2A5C', '#3B3F7A']) + lin('wt', ['#1A2050', '#0A0E26']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)');
      for (let i = 0; i < 40; i++) o += circ(r() * W, r() * 140, r() * 1.2 + 0.3, '#FFFFFF', `opacity="${f(0.3 + r() * 0.6)}"`);
      o += circ(60 + r() * 280, 50 + r() * 30, 16, '#F4F1DE', 'opacity="0.9"');
      o += skyline(r, 230, 40, 110, '#26305E', false) + skyline(r, 236, 50, 150, '#141A3C', true);
      o += rect(0, 234, W, 66, 'url(#wt)');
      for (let i = 0; i < 26; i++) o += rect(r() * W, 240 + r() * 55, 8 + r() * 26, 2, r() < 0.7 ? '#FFD98A' : '#9FD3FF', `opacity="${f(0.25 + r() * 0.4)}"`);
      return o;
    },
    mountains(r) {
      const warm = r() < 0.5;
      let o = '<defs>' + lin('sk', warm ? ['#8EC5FF', '#FFE0C2'] : ['#5D8FD6', '#CFE6FF']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + circ(80 + r() * 240, 70, 24, warm ? '#FFF1D0' : '#FFFFFF', 'opacity="0.95"');
      o += ridge(r, 150, 70, 7, '#9BB0D6') + ridge(r, 190, 70, 6, '#6E86B8') + ridge(r, 240, 50, 9, '#3F5A8A');
      o += rect(0, 268, W, 32, '#2E4A3A');
      for (let i = 0; i < 18; i++) {
        const x = r() * W, h = 20 + r() * 26;
        o += poly([[x, 272 - h], [x - 8, 274], [x + 8, 274]], '#1F3A2B');
      }
      return o;
    },
    window(r) {
      const t = r();
      const sky = t < 0.33 ? ['#3C6FC2', '#9CC8FF'] : t < 0.66 ? ['#2A2D6A', '#E57A6A', '#FFC98A'] : ['#0E1B3D', '#2C4A8A'];
      let o = '<defs>' + lin('sk', sky) + lin('fr', ['#E9ECF2', '#C9CFDA']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#fr)');
      o += `<clipPath id="win"><rect x="110" y="30" width="180" height="240" rx="80"/></clipPath>`;
      o += '<g clip-path="url(#win)">' + rect(0, 0, W, H, 'url(#sk)') + clouds(r, 7, 160, 260, '#FFFFFF', 0.85);
      o += poly([[150, 210], [300, 160], [300, 190], [210, 222]], '#D7DCE5') + poly([[150, 210], [210, 222], [205, 228], [150, 216]], '#AEB6C4');
      o += '</g><rect x="110" y="30" width="180" height="240" rx="80" fill="none" stroke="#B8BFCC" stroke-width="10"/>';
      o += `<rect x="128" y="48" width="144" height="204" rx="66" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>`;
      return o;
    },
    beach(r) {
      let o = '<defs>' + lin('sk', ['#69B7FF', '#CDEBFF']) + lin('sea', ['#1FA3C9', '#57D0D8']) + lin('sand', ['#F6DDA8', '#E9C485']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + circ(330, 60, 26, '#FFF4C2') + clouds(r, 3, 40, 90, '#FFFFFF', 0.8);
      o += rect(0, 150, W, 70, 'url(#sea)');
      for (let i = 0; i < 8; i++) o += rect(r() * W, 160 + r() * 50, 30 + r() * 40, 2, '#FFFFFF', 'opacity="0.5"');
      o += `<path d="M0 215 Q100 200 200 214 T400 210 V300 H0Z" fill="url(#sand)"/>`;
      const ux = 90 + r() * 200, c = ['#FF6B6B', '#FFD166', '#4ECDC4'][Math.floor(r() * 3)];
      o += rect(ux - 2, 190, 4, 70, '#8A6A4A') + `<path d="M${ux - 60} 196 Q${ux} 140 ${ux + 60} 196Z" fill="${c}"/>`;
      o += rect(ux + 20, 252, 70, 14, '#FFFFFF', 'rx="3" opacity="0.9"') + rect(ux + 20, 252, 70, 4, c, 'rx="2"');
      return o;
    },
    park(r) {
      let o = '<defs>' + lin('sk', ['#9AD0FF', '#E3F4FF']) + lin('gr', ['#7CC36A', '#4E9A4A']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + clouds(r, 3, 30, 80, '#FFFFFF', 0.9) + rect(0, 170, W, 130, 'url(#gr)');
      o += `<path d="M150 300 Q200 230 260 170 L290 170 Q240 240 250 300Z" fill="#E8D9B5"/>`;
      for (let i = 0; i < 6; i++) {
        const x = 20 + i * 70 + r() * 30, y = 150 + r() * 40, s = 26 + r() * 18;
        const g = ['#3F8F45', '#2F7A3C', '#58A55A'][Math.floor(r() * 3)];
        o += rect(x - 4, y, 8, 40, '#7A5A3A') + circ(x, y - 4, s, g) + circ(x - s * 0.6, y + 6, s * 0.7, g) + circ(x + s * 0.6, y + 6, s * 0.7, g);
      }
      return o;
    },
    rooftop(r) {
      let o = '<defs>' + lin('sk', ['#1C1A4A', '#5A2E6E', '#E06C6C']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + skyline(r, 210, 30, 120, '#1A1534', true);
      o += rect(0, 210, W, 90, '#231B33') + rect(0, 206, W, 6, '#3A2E4F');
      for (let i = 0; i < 9; i++) o += rect(i * 48, 212, 4, 40, '#3A2E4F');
      o += rect(0, 228, W, 3, '#3A2E4F');
      for (let k = 0; k < 2; k++) {
        const y0 = 40 + k * 40;
        o += `<path d="M-10 ${y0} Q200 ${y0 + 60} 410 ${y0}" stroke="#2A2340" stroke-width="1.5" fill="none"/>`;
        for (let i = 0; i <= 14; i++) {
          const t = i / 14, x = -10 + 420 * t, y = y0 + 120 * t * (1 - t);
          o += circ(x, y + 4, 7, '#FFD27A', 'opacity="0.25"') + circ(x, y + 4, 3, '#FFE7B0');
        }
      }
      return o;
    },
    rain(r) {
      let o = '<defs>' + lin('bg', ['#1F2A3F', '#2D3B55']) + '</defs>' + rect(0, 0, W, H, 'url(#bg)');
      for (let i = 0; i < 22; i++) {
        const c = ['#FFB84D', '#FF6B6B', '#7FD1FF', '#FFE08A'][Math.floor(r() * 4)];
        o += circ(r() * W, 120 + r() * 160, 10 + r() * 26, c, `opacity="${f(0.12 + r() * 0.25)}"`);
      }
      for (let i = 0; i < 70; i++) {
        const x = r() * W, y = r() * H, l = 6 + r() * 16;
        o += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x - 2)}" y2="${f(y + l)}" stroke="#CFE3FF" stroke-opacity="${f(0.2 + r() * 0.4)}" stroke-width="1.2"/>`;
      }
      for (let i = 0; i < 14; i++) o += circ(r() * W, r() * H, 2 + r() * 4, '#E8F2FF', 'opacity="0.35"');
      return o;
    },
    concert(r) {
      let o = '<defs>' + lin('bg', ['#0A0618', '#1E0F3A']) + lin('beam', ['#FFFFFF', '#FFFFFF00']) + '</defs>' + rect(0, 0, W, H, 'url(#bg)');
      const cols = ['#FF4FD8', '#4FD8FF', '#FFE14F', '#7B5CFF'];
      for (let i = 0; i < 5; i++) {
        const x = 40 + i * 80, c = cols[Math.floor(r() * cols.length)], sway = (r() - 0.5) * 160;
        o += poly([[x - 6, 0], [x + 6, 0], [x + sway + 70, H], [x + sway - 70, H]], c, 'opacity="0.18"');
        o += circ(x, 6, 8, c);
      }
      o += rect(60, 170, 280, 10, '#2A1C4A');
      for (let i = 0; i < 22; i++) {
        const x = i * 19 + r() * 8, s = 12 + r() * 8;
        o += circ(x, 260 - r() * 10, s, '#05030C') + rect(x - s, 262, s * 2, 40, '#05030C');
        if (r() < 0.25) o += rect(x + 4, 220 - r() * 20, 4, 30, '#05030C', 'rx="2"');
      }
      return o;
    },
    court(r) {
      let o = '<defs>' + lin('fl', ['#D9A066', '#B97A43']) + lin('wall', ['#1B2440', '#2B3760']) + '</defs>';
      o += rect(0, 0, W, 140, 'url(#wall)');
      for (let i = 0; i < 60; i++) o += circ(r() * W, 20 + r() * 110, 1.5 + r() * 2, ['#FFFFFF', '#F4C430', '#7FB3FF'][Math.floor(r() * 3)], 'opacity="0.5"');
      o += poly([[0, 140], [W, 140], [W, H], [0, H]], 'url(#fl)');
      for (let i = 0; i < 12; i++) o += `<line x1="${i * 40}" y1="140" x2="${i * 60 - 130}" y2="300" stroke="#A86B38" stroke-opacity="0.35"/>`;
      o += `<ellipse cx="200" cy="230" rx="150" ry="46" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>`;
      o += rect(170, 40, 60, 42, '#FFFFFF', 'opacity="0.92"') + rect(188, 58, 24, 18, 'none', 'stroke="#E2572B" stroke-width="2"');
      o += `<ellipse cx="200" cy="86" rx="16" ry="4" fill="none" stroke="#E2572B" stroke-width="3"/>`;
      o += `<path d="M186 88 L192 112 M200 90 L200 114 M214 88 L208 112" stroke="#FFFFFF" stroke-opacity="0.7"/>`;
      const bx = 110 + r() * 180;
      o += circ(bx, 200, 16, '#E8772E') + `<path d="M${bx - 16} 200 H${bx + 16} M${bx} 184 V216" stroke="#7A3A12" stroke-width="1.5"/>`;
      return o;
    },
    harbor(r) {
      let o = '<defs>' + lin('sk', ['#7FB8F0', '#FFE3C4']) + lin('wt', ['#3C7BB0', '#1F4C78']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + clouds(r, 2, 30, 70, '#FFFFFF', 0.8) + skyline(r, 170, 20, 60, '#8BA3C7', false);
      o += rect(0, 168, W, 132, 'url(#wt)');
      for (let i = 0; i < 20; i++) o += rect(r() * W, 180 + r() * 110, 14 + r() * 30, 2, '#FFFFFF', 'opacity="0.35"');
      for (let i = 0; i < 3; i++) {
        const x = 50 + i * 120 + r() * 40, y = 210 + r() * 40, c = ['#FFFFFF', '#E85D4A', '#FFD166'][i];
        o += poly([[x - 34, y], [x + 34, y], [x + 24, y + 14], [x - 24, y + 14]], c);
        o += rect(x - 1, y - 52, 2, 52, '#5A4A3A') + poly([[x + 2, y - 50], [x + 2, y - 4], [x + 30, y - 4]], '#FFFFFF', 'opacity="0.95"');
      }
      for (let i = 0; i < 7; i++) o += rect(i * 60 + 10, 260, 8, 40, '#5A4430');
      o += rect(0, 256, W, 8, '#7A5C3E');
      return o;
    },
    tram(r) {
      let o = '<defs>' + lin('sk', ['#BFE0FF', '#F4F9FF']) + '</defs>' + rect(0, 0, W, H, 'url(#sk)') + skyline(r, 200, 50, 130, '#C9D4E5', false);
      o += `<line x1="0" y1="40" x2="${W}" y2="52" stroke="#4A5568" stroke-width="1.5"/>`;
      o += rect(0, 236, W, 64, '#6B7280') + rect(0, 240, W, 3, '#D1D5DB') + rect(0, 262, W, 3, '#D1D5DB');
      const x = 60 + r() * 40;
      o += rect(x, 120, 260, 112, '#E8533F', 'rx="18"') + rect(x, 196, 260, 14, '#FFFFFF', 'opacity="0.9"');
      for (let i = 0; i < 5; i++) o += rect(x + 16 + i * 48, 136, 38, 44, '#BFE6FF', 'rx="6"');
      o += `<line x1="${x + 130}" y1="120" x2="${x + 150}" y2="48" stroke="#2D3748" stroke-width="3"/>`;
      o += circ(x + 50, 234, 10, '#2D3748') + circ(x + 210, 234, 10, '#2D3748');
      return o;
    },
    bricks(r) {
      let o = '<defs>' + lin('sk', ['#A9D6FF', '#E9F5FF']) + lin('gr', ['#7DBE68', '#5C9E4E']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + rect(0, 150, W, 150, 'url(#gr)');
      for (let i = 0; i < 9; i++) o += rect(i * 46, 110, 40, 56, '#D8C3A0') + rect(i * 46, 104, 40, 8, '#CDB48C');
      for (let row = 0; row < 6; row++) {
        const n = 7 - row;
        for (let i = 0; i < n; i++) {
          const x = 110 + row * 16 + i * 30 + r() * 4, y = 262 - row * 16;
          o += rect(x, y, 28, 14, ['#B5482F', '#C0563A', '#A33F28'][Math.floor(r() * 3)], `rx="2" transform="rotate(${f((r() - 0.5) * 8)} ${f(x + 14)} ${f(y + 7)})"`);
        }
      }
      o += rect(300, 238, 50, 36, '#9CA3AF', 'rx="4"') + rect(306, 226, 38, 14, '#6B7280', 'rx="3"');
      return o;
    },
    oven(r) {
      let o = '<defs>' + lin('sk', ['#2B2D5E', '#C76A6A', '#FFB27A']) + lin('gr', ['#4F7A3E', '#36592C']) + rad('fire', '#FFD27A', '#FF6A2A') + '</defs>';
      o += rect(0, 0, W, H, 'url(#sk)') + rect(0, 200, W, 100, 'url(#gr)');
      for (let i = 0; i < 9; i++) o += rect(i * 46, 150, 40, 62, '#5A4632') + rect(i * 46, 144, 40, 8, '#4A3A2A');
      o += rect(100, 200, 200, 60, '#8A8F99', 'rx="4"');
      o += `<path d="M110 205 A90 90 0 0 1 290 205 Z" fill="#B5482F" transform="rotate(-3 200 205)"/>`;
      for (let row = 0; row < 5; row++) for (let i = 0; i < 8; i++) {
        const y = 196 - row * 16, x = 120 + i * 21 + (row % 2) * 10;
        const dx = x - 200, dy = y - 205;
        if (dx * dx + dy * dy < 80 * 80) o += rect(x, y, 18, 10, 'none', 'stroke="#7A2E1C" stroke-width="1" opacity="0.6"');
      }
      o += `<path d="M168 205 A32 34 0 0 1 232 205 Z" fill="#1A0E08"/>` + `<ellipse cx="200" cy="198" rx="24" ry="12" fill="url(#fire)"/>`;
      o += rect(250, 120, 18, 40, '#7A2E1C') + circ(259, 104, 12, '#C9C9C9', 'opacity="0.5"') + circ(266, 86, 16, '#C9C9C9', 'opacity="0.35"');
      return o;
    },
    restaurant(r) {
      let o = '<defs>' + lin('bg', ['#2A140C', '#4A2414']) + rad('candle', '#FFC86B', '#FFC86B') + lin('tb', ['#F4EDE1', '#D9CDBA']) + '</defs>';
      o += rect(0, 0, W, H, 'url(#bg)');
      for (let i = 0; i < 12; i++) o += circ(r() * W, r() * 150, 8 + r() * 20, '#FFB45A', `opacity="${f(0.08 + r() * 0.15)}"`);
      o += `<ellipse cx="200" cy="250" rx="230" ry="90" fill="url(#tb)"/>`;
      o += circ(120, 150, 90, 'url(#candle)', 'opacity="0.45"') + rect(114, 150, 12, 50, '#F7F1E3', 'rx="2"');
      o += `<path d="M120 132 q8 10 0 18 q-8 -8 0 -18Z" fill="#FFD27A"/>`;
      o += `<ellipse cx="220" cy="236" rx="70" ry="24" fill="#FFFFFF"/>` + emo('🍝', 220, 222, 64);
      o += `<path d="M300 150 q14 0 14 18 q0 18 -14 20 q-14 -2 -14 -20 q0 -18 14 -18Z M300 188 V218 M290 220 H310" fill="#7A1F2B" stroke="#E8DCC8" stroke-width="2"/>`;
      return o;
    }
  };

  // Object photos: one big emoji on a setting that suits it.
  const SETTINGS = {
    table: (r) => {
      let o = '<defs>' + lin('wd', ['#B9814E', '#8E5B33']) + '</defs>' + rect(0, 0, W, H, 'url(#wd)');
      for (let i = 0; i < 14; i++) o += `<path d="M0 ${f(i * 22 + r() * 8)} Q200 ${f(i * 22 + (r() - 0.5) * 20)} 400 ${f(i * 22 + r() * 8)}" stroke="#7A4A26" stroke-opacity="0.35" fill="none"/>`;
      // a napkin, fork and knife either side of the plate
      o += rect(20, 96, 52, 150, '#F1E6D2', 'rx="6" transform="rotate(-4 46 171)"') + rect(42, 104, 6, 132, '#C9CED6', 'rx="3"') +
        [0, 7, 14].map(dx => rect(36 + dx, 100, 3, 26, '#C9CED6', 'rx="1.5"')).join('') + rect(346, 100, 8, 140, '#C9CED6', 'rx="4"') + rect(343, 100, 14, 44, '#DDE1E7', 'rx="7"');
      return o + `<ellipse cx="200" cy="174" rx="132" ry="108" fill="#000" opacity="0.12"/><ellipse cx="200" cy="170" rx="128" ry="104" fill="#F7F4EE"/><ellipse cx="200" cy="170" rx="104" ry="84" fill="none" stroke="#E2DCD0" stroke-width="2"/>`;
    },
    grass: () => '<defs>' + lin('g', ['#8ED07A', '#4E9A4A']) + '</defs>' + rect(0, 0, W, H, 'url(#g)'),
    sofa: (r) => {
      const c = ['#E9D5FF', '#FFD6C9', '#CDE7F0'][Math.floor(r() * 3)];
      return rect(0, 0, W, H, c) + rect(20, 150, 360, 150, '#8E7CC3', 'rx="30" opacity="0.55"') + rect(50, 120, 300, 70, '#8E7CC3', 'rx="24" opacity="0.4"');
    },
    shelf: (r) => {
      const c = ['#F3EDE4', '#E7EFE9', '#EDE9F5'][Math.floor(r() * 3)];
      return rect(0, 0, W, H, c) + rect(0, 236, W, 64, '#C9A982') + rect(0, 232, W, 8, '#B08D63');
    },
    floor: () => rect(0, 0, W, H, '#3A3F4A') + rect(0, 200, W, 100, '#2A2E36'),
    street: () => '<defs>' + lin('s', ['#9AA3AF', '#6B7280']) + '</defs>' + rect(0, 0, W, H, 'url(#s)'),
    neon: (r) => '<defs>' + lin('n', ['#2A0F4A', '#4A1F6A']) + '</defs>' + rect(0, 0, W, H, 'url(#n)') + circ(80 + r() * 240, 80, 120, '#FF4FD8', 'opacity="0.15"'),
    sill: () => '<defs>' + lin('w', ['#BFE3FF', '#FFFFFF']) + '</defs>' + rect(0, 0, W, H, 'url(#w)') + rect(0, 240, W, 60, '#E8E2D6') + rect(196, 0, 8, 240, '#FFFFFF')
  };
  const OBJECTS = {
    pizza: ['🍕', 'table'], pasta: ['🍝', 'table'], coffee: ['☕', 'table'], ramen: ['🍜', 'table'], tacos: ['🌮', 'table'],
    cake: ['🍰', 'table'], sandwich: ['🥪', 'table'], cocktail: ['🍸', 'neon'], bread: ['🥖', 'table'],
    dog: ['🐕', 'grass'], cat: ['🐈', 'sofa'], plant: ['🪴', 'shelf'], books: ['📚', 'shelf'], desk: ['💻', 'shelf'],
    gym: ['🏋️', 'floor'], sneakers: ['👟', 'street'], guitar: ['🎸', 'neon'], game: ['🎮', 'neon'], flowers: ['💐', 'sill']
  };

  AM.SCENES = Object.keys(scenes).concat(Object.keys(OBJECTS));

  const cache = new Map();
  AM.art = function (scene, seed) {
    const key = scene + ':' + seed;
    if (cache.has(key)) return cache.get(key);
    const r = rng(seed || 1);
    let body;
    if (scenes[scene]) body = scenes[scene](r);
    else {
      const ob = OBJECTS[scene] || ['✨', 'sill'];
      const tilt = f((r() - 0.5) * 16);
      body = SETTINGS[ob[1]](r) + `<ellipse cx="200" cy="${ob[1] === 'table' ? 230 : 250}" rx="90" ry="16" fill="#000" opacity="0.18"/>` +
        emo(ob[0], 200, 160, 150, `transform="rotate(${tilt} 200 160)"`);
    }
    // Every photo gets the same finish: a soft light from the top left and a gentle vignette.
    const finish = '<defs><linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.16"/><stop offset="0.55" stop-color="#FFF" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="vig" cx="50%" cy="46%" r="72%"><stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></radialGradient></defs>' +
      `<rect width="${W}" height="${H}" fill="url(#sheen)"/><rect width="${W}" height="${H}" fill="url(#vig)"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${body}${finish}</svg>`;
    const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    cache.set(key, uri);
    return uri;
  };

  // Profile banners: a soft band in the account's hue.
  AM.banner = function (hue, seed) {
    const r = rng(seed);
    let o = '<defs>' + lin('b', [`hsl(${hue},55%,55%)`, `hsl(${(hue + 40) % 360},60%,40%)`], 1, 1) + '</defs>' + rect(0, 0, W, 120, 'url(#b)');
    for (let i = 0; i < 6; i++) o += circ(r() * W, r() * 120, 20 + r() * 60, '#FFFFFF', `opacity="${f(0.05 + r() * 0.1)}"`);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 120" preserveAspectRatio="xMidYMid slice">${o}</svg>`);
  };
})();
