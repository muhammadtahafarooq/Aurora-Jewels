# Image Asset Manifest

Every `<img>` slot on the site points to a path below. If a file is missing, a warm
surface placeholder shows automatically (via `onerror`), so pages never break.

Source screenshots (copied for reference) live in
`app/public/images/reference/Screenshot 2026-08-21 *.png` — crop the relevant
region from each and save it at the target path to light the site up.

## Global

| Target path | Used by | Crop from screenshot |
| --- | --- | --- |
| `/images/home/hero.jpg` | Homepage dark hero background (portrait, model shot) | `165236.png` — top hero area |
| `/images/home/story.jpg` | Homepage "Quiet luxury" brand story block | `165236.png` or `165338.png` editorial image |

## Collections (4:5 portrait)

| Target path | Label shown |
| --- | --- |
| `/images/collections/heritage.jpg` | The Heritage Collection |
| `/images/collections/aurora-gold.jpg` | Aurora Gold |
| `/images/collections/lumiere-pearls.jpg` | Lumière Pearls |

Crop sources: `165236.png` — "Featured Collections" trio (3 images).

## Products (main 4:5 + 3 gallery views)

Pattern: `/images/products/{slug}-{1..4}.jpg`

| Slug | Product name | Crop source |
| --- | --- | --- |
| `the-veridian-solitaire` | The Veridian Solitaire | `165320.png` — PDP main + thumbnails |
| `celeste-pendant-necklace` | Celeste Pendant Necklace | `165250.png` / `165302.png` grid cells |
| `lune-huggie-earrings` | Lune Huggie Earrings | grid cells |
| `sera-tennis-bracelet` | Sera Tennis Bracelet | grid cells |
| `iris-stacking-ring` | Iris Stacking Ring | grid cells |
| `nova-drop-earrings` | Nova Drop Earrings | grid cells |
| `atlas-chain-necklace` | Atlas Chain Necklace | grid cells |
| `vela-cuff-bracelet` | Vela Cuff Bracelet | grid cells |

The shop grid (`165250.png`) contains all 8 product photos in a 4-column layout —
crop each cell individually.
