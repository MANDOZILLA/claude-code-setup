/* In-page UI audit probe.
 *
 * NOT a node script. Paste the whole IIFE as the `function` body of an in-page
 * evaluator and read the returned JSON:
 *   - chrome-devtools MCP : evaluate_script  { function: "() => { <this file> }" }
 *   - claude-in-chrome    : javascript_tool
 *
 * Reports only machine-checkable facts. Everything it flags is a real measured
 * value, so a clean run is meaningful evidence — but a clean run does NOT mean
 * the page looks good. Judgment items (rhythm, hierarchy, colour, copy) still
 * need eyes; see references/defect-catalog.md.
 *
 * Run it once per page AND per breakpoint AND per theme — several of these
 * checks only fail in one combination.
 */
(() => {
  const vw = document.documentElement.clientWidth;
  const out = { url: location.pathname, viewport: vw, theme: document.documentElement.dataset.theme || document.documentElement.dataset.marketingTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark(system)' : 'light(system)') };

  const cls = (el) => {
    const c = el.className;
    const s = typeof c === 'string' ? c : (c && c.baseVal) || '';
    // CSS-module classes look like "landing-module__hash__realName"
    return s.trim().split(/\s+/)[0]?.split('__').pop()?.slice(0, 28) || '';
  };
  const label = (el) => (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 34);

  /* ---- horizontal overflow ------------------------------------------------
   * Page-level overflow is always a bug. An element extending past the
   * viewport is only a bug if nothing between it and <body> scrolls it —
   * a wide table inside overflow-x:auto is the correct pattern, not a defect. */
  const scrolledByAncestor = (el) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const ov = getComputedStyle(n).overflowX;
      if (ov === 'auto' || ov === 'scroll' || ov === 'hidden' || ov === 'clip') return true;
    }
    return false;
  };
  out.pageOverflowsHorizontally = document.documentElement.scrollWidth > vw + 1;
  out.scrollWidth = document.documentElement.scrollWidth;
  const bleeding = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 1 && !scrolledByAncestor(el)) bleeding.push(el.tagName + '.' + cls(el));
  });
  out.elementsBleedingPastViewport = [...new Set(bleeding)].slice(0, 10);

  /* ---- tap targets (WCAG 2.5.8, 24x24 minimum) ----------------------------
   * Links sitting inline inside a sentence are explicitly exempt. Detect that
   * by checking whether the containing block has materially more text. */
  const inlineInSentence = (el) => {
    const p = el.closest('p, li, figcaption, blockquote, label');
    return !!p && p.textContent.trim().length > el.textContent.trim().length + 10;
  };
  const small = [];
  document.querySelectorAll('a, button, summary, input, select, textarea, [role=switch], [role=button], [role=tab]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 && r.height < 2) return;           // sr-only / visually hidden
    if (getComputedStyle(el).display === 'none') return;
    if (inlineInSentence(el)) return;
    if (r.height < 23.5 || r.width < 23.5) small.push(`${label(el)} [${el.tagName}.${cls(el)}] ${Math.round(r.width)}x${Math.round(r.height)}`);
  });
  out.tapTargetsUnder24px = small.slice(0, 20);

  /* ---- document semantics ------------------------------------------------- */
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.getBoundingClientRect().height > 0);
  const lv = heads.map((h) => +h.tagName[1]);
  const skips = [];
  for (let i = 1; i < lv.length; i++) if (lv[i] - lv[i - 1] > 1) skips.push(`h${lv[i - 1]}->h${lv[i]} at "${heads[i].textContent.trim().slice(0, 28)}"`);
  out.h1Count = document.querySelectorAll('h1').length;   // must be exactly 1
  out.headingLevelSkips = skips;
  out.headingOutline = heads.slice(0, 30).map((h) => h.tagName + ': ' + h.textContent.trim().slice(0, 42));
  out.imagesMissingAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => (i.currentSrc || i.src || '').split('/').pop()).slice(0, 10);
  out.linksWithNoAccessibleName = [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])')).map((a) => a.getAttribute('href')).slice(0, 10);
  out.buttonsWithNoAccessibleName = [...document.querySelectorAll('button')].filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label') && b.getBoundingClientRect().height > 0).length;
  out.hasSkipLink = !!document.querySelector('a[href^="#"]:first-of-type, a.sr-only[href^="#"]');
  out.viewportMeta = (document.querySelector('meta[name=viewport]') || {}).content || 'MISSING';
  out.title = document.title || 'MISSING';
  out.metaDescription = (document.querySelector('meta[name=description]') || {}).content ? 'present' : 'MISSING';
  out.langAttr = document.documentElement.lang || 'MISSING';

  /* ---- adjacent sections sharing a background -----------------------------
   * Two stacked bands on the same colour read as one block split by a hairline.
   * This is invisible in code review because the two sides usually reference
   * different-looking tokens that resolve to the same value. */
  const bands = [...document.querySelectorAll('main > section, body > section, main > div > section, footer')];
  const merged = [];
  for (let i = 1; i < bands.length; i++) {
    const a = getComputedStyle(bands[i - 1]).backgroundColor;
    const b = getComputedStyle(bands[i]).backgroundColor;
    const opaque = (c) => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent';
    if (opaque(a) && opaque(b) && a === b) merged.push(`${bands[i - 1].tagName}.${cls(bands[i - 1])} + ${bands[i].tagName}.${cls(bands[i])} both ${a}`);
  }
  out.adjacentSectionsSameBackground = merged;

  /* ---- container alignment -------------------------------------------------
   * A section intro that is centred while its own content grid is full-width
   * gives the two blocks different left edges. Classic cause: a max-width and a
   * `margin-inline:auto` container class applied to the SAME element. */
  const edges = bands.map((s) => {
    const kids = [...s.children].filter((k) => k.getBoundingClientRect().width > 0);
    const ls = [...new Set(kids.map((k) => Math.round(k.getBoundingClientRect().left)))];
    return { section: s.tagName + '.' + cls(s), childLeftEdges: ls.slice(0, 6), ragged: ls.length > 1 && Math.max(...ls) - Math.min(...ls) > 8 };
  });
  out.sectionsWithRaggedLeftEdges = edges.filter((e) => e.ragged).slice(0, 8);

  /* ---- media integrity -----------------------------------------------------
   * object-fit:cover silently crops whenever the declared box aspect differs
   * from the asset's true aspect. */
  out.media = [...document.querySelectorAll('video, img')].filter((m) => m.getBoundingClientRect().width > 40).slice(0, 12).map((m) => {
    const r = m.getBoundingClientRect();
    const natW = m.videoWidth || m.naturalWidth, natH = m.videoHeight || m.naturalHeight;
    if (!natW || !natH) return { src: (m.currentSrc || m.src || '').split('/').pop(), note: 'not loaded yet' };
    const boxA = r.width / r.height, natA = natW / natH;
    const fit = getComputedStyle(m).objectFit;
    return {
      src: (m.currentSrc || m.src || '').split('/').pop(),
      intrinsic: `${natW}x${natH}`,
      croppedByObjectFit: fit === 'cover' && Math.abs(boxA - natA) > 0.01,
      stretched: fit === 'fill' && Math.abs(boxA - natA) > 0.01,
    };
  });

  /* ---- tiny text ----------------------------------------------------------- */
  const tiny = new Set();
  document.querySelectorAll('p, li, span, div, td, label, a, button').forEach((el) => {
    if (!el.textContent.trim() || el.children.length) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs && fs < 11) tiny.add(`${Math.round(fs)}px  ${el.tagName}.${cls(el)}  "${el.textContent.trim().slice(0, 30)}"`);
  });
  out.textUnder11px = [...tiny].slice(0, 10);

  return out;
})()
