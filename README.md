# Bubble Truck Window Cleaning — Homepage Redesign

A custom, mobile-first homepage concept for **Bubble Truck Window Cleaning** (Renton, WA) — a family-run window cleaning, gutter cleaning and Christmas light installation company serving King and Pierce Counties.

Built as a plain static site (HTML5 + CSS3 + vanilla JavaScript) so it can be served directly from GitHub Pages with no build step, backend or dependencies.

---

## Live preview

Open `index.html` locally, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### GitHub Pages

The site is rooted at the repository root, so Pages can serve it directly:

1. Repository **Settings → Pages**
2. **Source:** *Deploy from a branch*
3. **Branch:** `main` · **Folder:** `/ (root)`
4. Save — the site publishes at `https://redesignbyasif.github.io/bubbletruckwindowcleaning.com/`

`.nojekyll` is included so Pages serves the folder verbatim.

---

## Structure

```
.
├── index.html              # the entire homepage (semantic sections)
├── css/
│   └── style.css           # design system, tokens, layout, responsive rules
├── js/
│   └── script.js           # navigation, dropdown, accordion, sticky CTAs
├── assets/
│   ├── logo/               # original Bubble Truck mark (transparent PNG) + favicons
│   └── images/             # optimised WebP + JPEG photography
├── .nojekyll
└── README.md
```

---

## Brand

Sampled directly from the company's original logo:

| Token | Value | Use |
| --- | --- | --- |
| Brand azure | `#0064AF` | primary buttons, links, accents |
| Deep azure | `#004471` | hover states, eyebrow text |
| Signature pink | `#F75DD5` | small accents (borrowed from the mascot's bow) |
| Ink navy | `#0A1826` | dark sections, body text |
| Warm paper | `#FBF8F3` | page background |

**Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for display (with italic accent words) and [Manrope](https://fonts.google.com/specimen/Manrope) for UI and body copy. Two families only, loaded from Google Fonts with `display=swap`.

**Design direction:** an editorial "glass & paper" treatment — warm paper stock, hairline window-pane rules, large serif headlines, square corners, and full-bleed documentary photography. Deliberately not a template: no gradient hero, no rounded card grid, no stock "team in a boardroom" imagery.

---

## Sections

1. Sticky header with services dropdown, click-to-call and estimate CTA
2. Hero — statement headline, real trust signals, photography
3. Services ticker (marquee, pauses on hover, static under reduced-motion)
4. The Bubble Standard — story, stats, pet-friendly detail, owner signature
5. Services — window cleaning, gutter cleaning, Christmas lights
6. Why homeowners stay — six proof points on ink navy
7. How it works — three steps
8. Google reviews — genuine quoted reviews with attribution
9. Service area — King & Pierce County city grid
10. FAQ — accessible accordion
11. Final CTA — phone numbers, email, address, booking link
12. Footer + legal links
13. Floating mobile action bar (Call · Free estimate) and back-to-top button

---

## Content sources

All business facts, phone numbers, address, hours, service descriptions, service-area cities and customer reviews come from the existing website <https://www.bubbletruckwindowcleaning.com/>. No business information was invented. Booking buttons point at the company's live ResponsiBid estimate form; service links point at the live service pages.

**Imagery**

- The **logo** is the company's original mark, background removed and trimmed for digital use (colour and artwork unchanged).
- Supporting photography was generated for this concept as illustrative brand imagery (technician at work, squeegee detail, branded van, pet behind clean glass, holiday lighting). It is **not** presented as documentation of specific customer projects.
- Every image ships as optimised WebP with a JPEG fallback, explicit dimensions, `loading="lazy"` below the fold, and descriptive `alt` text.

---

## Accessibility & technical notes

- Mobile-first CSS, tested at 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 px; no horizontal overflow at any width
- Keyboard accessible navigation, dropdown and accordion (`aria-expanded`, `aria-controls`, Escape to close, focus returned on close)
- Skip link, visible focus rings, semantic landmarks, heading hierarchy, colour contrast checked on both paper and ink surfaces
- `prefers-reduced-motion` disables the marquee and entrance animation
- Relative asset paths — works from a repository subdirectory as well as a domain root
- `meta robots="noindex, nofollow"` so the concept page never competes with the live site in search
- No tracking, no frameworks, no jQuery — roughly 40 KB of CSS/JS plus images

---

## QA

The homepage was rendered in headless Chromium at **360, 390, 430, 768, 1024, 1280 and 1440 px** with Playwright. Each run verified:

- no horizontal overflow (`scrollWidth === clientWidth` at every viewport)
- no console errors, page errors or failed network requests
- every image, stylesheet and script resolves over HTTP
- the mobile drawer, services dropdown and FAQ accordion open/close with correct ARIA state
- every in-page anchor resolves to a real target

Visual review was done from full-page and per-section screenshots at each breakpoint.

---

*Homepage concept only. All trademarks, the logo and business details belong to Bubble Truck Window Cleaning.*
