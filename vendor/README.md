# vendor/

Third-party files Ronak serves itself. Ronak promises no third-party requests
at runtime, so nothing here is loaded from a CDN. Each file is pinned and
unmodified apart from a one-line provenance comment on the files that had no
version header.

| File | Version | Licence | Used for |
|---|---|---|---|
| `gsap.min.js`, `CustomEase.min.js`, `SplitText.min.js` | GSAP 3.15.0 (npm `gsap`) | GSAP Standard "no charge" licence, https://gsap.com/standard-license (free for commercial use; not MIT) | motion.js and valley.js: headlines and figures rising from their lines, the valley's depth and surprises, the mood spark |
| `lenis.min.js` | Lenis 1.3.27 (npm `lenis`) | MIT (`licenses/LENIS-LICENSE.txt`) | smooth wheel scrolling on laptops, outside the check-ins |
| `three.r134.min.js` | three.js 0.134.0 | MIT (`licenses/THREE-LICENSE.txt`) | required by Vanta (pinned: newer three breaks it) |
| `vanta.birds.min.js` | Vanta 0.5.24 (npm `vanta`) | MIT (`licenses/VANTA-LICENSE.md`) | the 3D flock over the valley, on laptops and strong phones only |

Left out on purpose: ScrollTrigger and Flip (nothing here needs them; the
scroll's own effects are CSS scroll timelines, which run on the compositor),
DrawSVG and MorphSVG (they animate inside a drawing, which Ronak's motion
rules forbid: transform and opacity on HTML boxes only).

To update: `npm pack <pkg>@<version>`, copy the same `dist/*.min.js` files,
bump `REL` in `sw.js` and the `?v=` on every page.
