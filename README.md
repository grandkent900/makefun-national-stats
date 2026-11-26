# Nippon Numbers — Japan National Statistics

[![Make the best national statistics site](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/grandkent900/makefun-national-stats/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/grandkent900/makefun-national-stats/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An independent, original reference site for Japan's national statistics:
population, economy, labour, prices and regions — every figure with its
source and year.

## What it is

- **Overview** — six headline indicators for a chosen year (2021–2025),
  with population and GDP charts and the story the numbers tell.
- **Population** — total population 2015–2025, births and deaths in 2024
  (686,061 births, a record low), fertility rate 1.15.
- **Economy** — nominal GDP, GDP per capita and real growth, 2015–2025,
  switchable by indicator; nominal GDP $4.44 trillion in 2025, 4th in
  the world.
- **Labour & prices** — unemployment (2.5% in 2025) and CPI inflation
  (3.2% in 2025), switchable by indicator.
- **Regions** — the ten largest prefectures from the 2025 census, with a
  sortable table, a prefecture detail view and a five-year change sort.
- **Sources & methods** — the publisher, years and notes behind every
  figure, plus how to read the census-vs-estimate gap.

## Data

All figures are published statistics, checked in November 2026:

- World Bank, World Development Indicators — population, GDP, growth,
  unemployment, CPI inflation, life expectancy, urban share.
- Statistics Bureau of Japan — Labour Force Survey, Consumer Price Index,
  2025 Population Census (prefectures).
- Ministry of Health, Labour and Welfare — Vital Statistics 2024
  (births, deaths, fertility rate).

GDP per capita is nominal GDP divided by total population, computed on
the page. Nothing else on the site is estimated.

## How it works

Zero framework, zero network requests. The site is plain static files
under `app/`:

- `app/index.html` — page shell and navigation
- `app/data.js` — every figure, with source and year
- `app/format.js` — number formatting
- `app/charts.js` — hand-written inline SVG line and bar charts
- `app/app.js` — hash router, page renderers and controls
- `app/styles.css` — the whole design, system fonts only

Every control does something real: the year selector re-computes the
headline cards, the indicator switches swap charts and tables, the
region sort re-orders the prefecture table, and the prefecture selector
updates the detail card. Open `app/index.html` in any browser, or serve
`app/` with any static server — it works offline.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes
`/output/dossier.json` with the kit's `buildDossier` from
`vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
