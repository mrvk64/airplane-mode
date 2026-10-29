// Airplane Mode: illustrated avatars. Each person in Harbor City gets a drawn face built from a few
// parts; brand and bot accounts (and the kids world's animals) keep their emoji badges.
// AM.face(id, hue) returns a cached data: URI, or null when the id has no look.
window.AM = window.AM || {};

(function () {
  const SKIN = ['#F7D7BE', '#EDB892', '#D69D6E', '#B9784C', '#8E5A3A', '#6A4029'];
  const HAIR = { black: '#231915', dark: '#4A2F1F', brown: '#7B4D2B', blonde: '#DDB466', red: '#B04A2A', gray: '#BDBDC6', pink: '#EE8CC8', blue: '#5B8DEF' };
  AM.LOOKS = {
    jade: { skin: 2, hair: 'long', hc: 'dark', mouth: 'grin', acc: 'earrings', shirt: '#F3A6C8' },
    luca: { skin: 1, hair: 'swoop', hc: 'black', mouth: 'smile', acc: 'chef', beard: 'stubble', shirt: '#F4F1EA' },
    priya: { skin: 3, hair: 'bob', hc: 'black', mouth: 'smirk', acc: 'glasses', shirt: '#7B5EA7' },
    dev: { skin: 5, hair: 'buzz', hc: 'black', mouth: 'smile', acc: 'headphones', shirt: '#2D2F45' },
    margot: { skin: 0, hair: 'bun', hc: 'blonde', mouth: 'smirk', acc: 'earrings', shirt: '#D9CBB5' },
    theo: { skin: 2, hair: 'short', hc: 'black', mouth: 'grin', acc: 'headband', shirt: '#2E86DE' },
    greg: { skin: 0, hair: 'balding', hc: 'brown', mouth: 'grin', beard: 'full', shirt: '#C0563A' },
    carl: { skin: 4, hair: 'buzz', hc: 'black', mouth: 'smile', acc: 'cap', shirt: '#F28C28' },
    june: { skin: 0, hair: 'curly', hc: 'gray', mouth: 'smile', acc: 'glasses', shirt: '#9BC4A8' },
    kai: { skin: 1, hair: 'swoop', hc: 'pink', mouth: 'grin', acc: 'beanie', shirt: '#8E5BD6' },
    harry: { skin: 0, hair: 'short', hc: 'red', mouth: 'smirk', beard: 'stubble', shirt: '#E5484D' },
    lena: { skin: 4, hair: 'afro', hc: 'black', mouth: 'smile', acc: 'glasses', shirt: '#2EAE8C' },
    rosa: { skin: 2, hair: 'ponytail', hc: 'dark', mouth: 'grin', acc: 'headband', shirt: '#2EAE5A' },
    sam: { skin: 1, hair: 'curly', hc: 'brown', mouth: 'smile', beard: 'stubble', shirt: '#4A5A78' },
    marcus: { skin: 4, hair: 'short', hc: 'black', mouth: 'grin', acc: 'headphones', shirt: '#5B3FA8' },
    ava: { skin: 1, hair: 'long', hc: 'black', mouth: 'grin', acc: 'earrings', shirt: '#FF7AB6' },
    wren: { skin: 0, hair: 'bob', hc: 'red', mouth: 'neutral', freckles: true, shirt: '#5E6B8C' },
    ollie: { skin: 0, hair: 'swoop', hc: 'blonde', mouth: 'smirk', acc: 'tie', shirt: '#1F3A5F' },
    nina: { skin: 3, hair: 'bun', hc: 'dark', mouth: 'smile', acc: 'scarf', shirt: '#1F4E8C' }
  };

  // Hair that sits behind the head, the top layer of hair, mouths and accessories, as SVG snippets.
  const BACK = {
    long: hc => `<path d="M24 46c0-20 10-30 24-30s24 10 24 30v30H24z" fill="${hc}"/>`,
    ponytail: hc => `<path d="M66 34c10 4 12 18 6 28-2-10-6-16-10-18z" fill="${hc}"/>`,
    afro: hc => `<circle cx="48" cy="38" r="27" fill="${hc}"/>`,
    curly: hc => [[30, 24], [40, 22], [52, 22], [64, 24], [32, 36], [64, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${hc}"/>`).join(''),
    bun: hc => `<circle cx="48" cy="15" r="9" fill="${hc}"/>`
  };
  const TOP = {
    short: hc => `<path d="M29 40c-1-15 8-23 19-23s20 8 19 23c-3-7-9-11-19-11s-16 4-19 11z" fill="${hc}"/>`,
    swoop: hc => `<path d="M28 42c-2-16 8-25 21-25 10 0 19 6 19 18-6-6-14-6-22-2-6 3-12 5-18 9z" fill="${hc}"/>`,
    buzz: hc => `<path d="M30 38c0-12 8-19 18-19s18 7 18 19c-4-5-10-8-18-8s-14 3-18 8z" fill="${hc}" opacity="0.9"/>`,
    bob: hc => `<path d="M27 50c-3-20 6-32 21-32s24 12 21 32l-5-2c1-10-4-18-16-19-10 1-15 9-15 19z" fill="${hc}"/>`,
    long: hc => `<path d="M28 44c-1-16 8-26 20-26s21 10 20 26c-5-8-12-12-20-12s-15 4-20 12z" fill="${hc}"/>`,
    bun: hc => `<path d="M29 40c0-14 8-21 19-21s19 7 19 21c-4-7-10-10-19-10s-15 3-19 10z" fill="${hc}"/>`,
    ponytail: hc => `<path d="M29 40c0-14 8-21 19-21s19 7 19 21c-4-7-10-10-19-10s-15 3-19 10z" fill="${hc}"/>`,
    curly: hc => `<path d="M30 36c2-10 9-15 18-15s16 5 18 15c-5-4-11-6-18-6s-13 2-18 6z" fill="${hc}"/>`,
    afro: hc => `<path d="M29 38c2-9 9-14 19-14s17 5 19 14c-5-3-11-5-19-5s-14 2-19 5z" fill="${hc}"/>`,
    balding: hc => `<path d="M29 44c-2-6 0-12 4-14l2 10zM67 44c2-6 0-12-4-14l-2 10z" fill="${hc}"/>`
  };
  const MOUTH = {
    grin: '<path d="M40 52q8 8 16 0z" fill="#7A2E2E"/><path d="M41 52h14" stroke="#FFF" stroke-width="1.6"/>',
    smile: '<path d="M41 52q7 6 14 0" stroke="#7A2E2E" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
    smirk: '<path d="M42 54q7 2 13-3" stroke="#7A2E2E" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
    neutral: '<path d="M43 54h10" stroke="#7A2E2E" stroke-width="2.2" stroke-linecap="round"/>'
  };
  const ACC = {
    glasses: () => '<g fill="none" stroke="#1F2430" stroke-width="2"><circle cx="40" cy="43" r="6"/><circle cx="56" cy="43" r="6"/><path d="M46 43h4M34 42l-5-2M62 42l5-2"/></g>',
    headphones: hue => `<path d="M26 46c0-18 10-28 22-28s22 10 22 28" stroke="#1F2430" stroke-width="4" fill="none"/><rect x="21" y="40" width="9" height="14" rx="4" fill="#1F2430"/><rect x="66" y="40" width="9" height="14" rx="4" fill="#1F2430"/><rect x="67" y="43" width="7" height="8" rx="3" fill="hsl(${hue},80%,60%)"/>`,
    chef: () => '<path d="M32 26c-6-2-7-12 2-13 2-7 12-8 14-2 4-6 14-3 13 4 9 1 7 11 1 11z" fill="#FFFFFF"/><rect x="33" y="22" width="30" height="8" rx="2" fill="#ECE8E0"/>',
    cap: hue => `<path d="M28 34c0-11 9-17 20-17s20 6 20 17z" fill="hsl(${hue},70%,45%)"/><path d="M48 33h26c-2 4-6 5-12 5H48z" fill="hsl(${hue},70%,35%)"/>`,
    beanie: () => '<path d="M28 36c0-13 9-20 20-20s20 7 20 20z" fill="#2EAE8C"/><rect x="27" y="32" width="42" height="7" rx="3" fill="#24876D"/><circle cx="48" cy="14" r="4" fill="#24876D"/>',
    headband: () => '<rect x="28" y="30" width="40" height="5" rx="2.5" fill="#FFFFFF" opacity="0.92"/>',
    earrings: () => '<circle cx="29" cy="52" r="2" fill="#F2C200"/><circle cx="67" cy="52" r="2" fill="#F2C200"/>'
  };

  const cache = new Map();
  AM.face = function (id, hue) {
    const L = AM.LOOKS[id];
    if (!L) return null;
    if (cache.has(id)) return cache.get(id);
    const sk = SKIN[L.skin], hc = HAIR[L.hc] || HAIR.dark;
    let o = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},70%,72%)"/><stop offset="1" stop-color="hsl(${(hue + 38) % 360},60%,50%)"/></linearGradient>` +
      '<clipPath id="c"><circle cx="48" cy="48" r="48"/></clipPath></defs><g clip-path="url(#c)"><rect width="96" height="96" fill="url(#bg)"/>';
    if (BACK[L.hair]) o += BACK[L.hair](hc);
    // shoulders, neck, ears and head
    o += `<path d="M14 100c2-18 16-26 34-26s32 8 34 26z" fill="${L.shirt}"/><rect x="41" y="58" width="14" height="16" rx="6" fill="${sk}"/><path d="M41 66h14v6H41z" fill="rgba(0,0,0,0.12)"/>` +
      `<circle cx="29" cy="45" r="5" fill="${sk}"/><circle cx="67" cy="45" r="5" fill="${sk}"/><ellipse cx="48" cy="42" rx="19" ry="21" fill="${sk}"/>`;
    if (L.acc === 'tie') o += '<path d="M36 74h8l-4 8zM60 74h-8l4 8z" fill="#F4F1EA"/><path d="M44 74l4-3 4 3-3 3 2 15h-6l2-15z" fill="#C9A24A"/>';
    if (L.acc === 'scarf') o += '<path d="M36 72c6 5 18 5 24 0l3 6c-9 6-21 6-30 0z" fill="#E5484D"/>';
    if (L.beard === 'full') o += `<path d="M30 44c0 14 8 24 18 24s18-10 18-24c-4 8-10 10-18 10s-14-2-18-10z" fill="${hc}"/>`;
    if (L.beard === 'stubble') o += `<path d="M31 47c1 12 8 20 17 20s16-8 17-20c-4 6-9 9-17 9s-13-3-17-9z" fill="${hc}" opacity="0.28"/>`;
    // eyes, brows, cheeks
    o += '<ellipse cx="40" cy="43" rx="2.6" ry="3.1" fill="#2A1C16"/><ellipse cx="56" cy="43" rx="2.6" ry="3.1" fill="#2A1C16"/>' +
      '<circle cx="41" cy="42" r="0.9" fill="#FFF"/><circle cx="57" cy="42" r="0.9" fill="#FFF"/>' +
      `<path d="M35 37q5-3 9-1M52 36q4-2 9 1" stroke="${L.hc === 'gray' ? '#8D8D96' : hc}" stroke-width="2" stroke-linecap="round" fill="none"/>` +
      '<ellipse cx="35" cy="51" rx="3.6" ry="2.2" fill="#F08A8A" opacity="0.35"/><ellipse cx="61" cy="51" rx="3.6" ry="2.2" fill="#F08A8A" opacity="0.35"/>';
    if (L.freckles) o += [[36, 48], [39, 49], [57, 48], [60, 49]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.8" fill="#A0603A"/>`).join('');
    o += MOUTH[L.mouth] || '';
    if (TOP[L.hair]) o += TOP[L.hair](hc);
    if (ACC[L.acc]) o += ACC[L.acc](hue);
    o += '</g>';
    const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">${o}</svg>`);
    cache.set(id, uri);
    return uri;
  };
})();
