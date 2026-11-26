// Nippon Numbers: hash router and page renderers.
// One page per route; every control on a page re-renders that page from
// DATA, so each button, select and sort visibly changes what is shown.

const ROUTES = [
  { id: "overview", label: "Overview" },
  { id: "population", label: "Population" },
  { id: "economy", label: "Economy" },
  { id: "labour", label: "Labour & prices" },
  { id: "regions", label: "Regions" },
  { id: "sources", label: "Sources & methods" },
];

// Page-local state, reset when the route changes.
let state = {};

function currentRoute() {
  const hash = (window.location.hash || "#/overview").replace(/^#\/?/, "");
  const found = ROUTES.find((r) => r.id === hash);
  return found ? found.id : "overview";
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function navHtml(active) {
  return ROUTES.map((r) =>
    '<a href="#/' + r.id + '" class="' + (r.id === active ? "active" : "") + '">' + r.label + "</a>"
  ).join("");
}

function kpiCard(label, valueHtml, deltaHtml, src) {
  return '<div class="kpi"><div class="label">' + label + '</div><div class="value">' +
    valueHtml + '</div><div class="delta">' + deltaHtml + '</div><div class="src">' + src + "</div></div>";
}

function yearOptions(selected, years) {
  return years.map((y) =>
    '<option value="' + y + '"' + (y === selected ? " selected" : "") + ">" + y + "</option>"
  ).join("");
}

// ---------- Overview ----------

function renderOverview() {
  if (!state.year) state.year = 2025;
  if (!state.popUnit) state.popUnit = "m";
  const y = state.year;
  const years = [2021, 2022, 2023, 2024, 2025];
  const pop = valueInYear(DATA.population, y);
  const popPrev = valueInYear(DATA.population, y - 1);
  const gdp = valueInYear(DATA.gdpNominalBnUsd, y);
  const gdpPrev = valueInYear(DATA.gdpNominalBnUsd, y - 1);
  const pc = gdpPerCapita(y);
  const pcPrev = gdpPerCapita(y - 1);
  const un = valueInYear(DATA.unemploymentPct, y);
  const unPrev = valueInYear(DATA.unemploymentPct, y - 1);
  const cpi = valueInYear(DATA.cpiInflationPct, y);
  const cpiPrev = valueInYear(DATA.cpiInflationPct, y - 1);
  const fert = y === 2024 ? DATA.vital2024.fertilityRate : null;

  const popValue = state.popUnit === "m"
    ? fmtMillions(pop) + ' <small>million</small>'
    : fmtInt(pop) + ' <small>people</small>';

  let html = "<h2>Japan at a glance</h2>" +
    '<p class="lede">The headline numbers for Japan — population, output, jobs and prices — ' +
    "each with its source and year. Pick a year to see that year's figures.</p>" +
    '<div class="controls"><div><label for="ov-year">Year</label>' +
    '<select id="ov-year">' + yearOptions(y, years) + "</select></div>" +
    '<div><label>Population shown as</label><div class="seg">' +
    '<button type="button" data-popunit="m" class="' + (state.popUnit === "m" ? "on" : "") + '">Millions</button>' +
    '<button type="button" data-popunit="n" class="' + (state.popUnit === "n" ? "on" : "") + '">Persons</button>' +
    "</div></div></div>" +
    '<div class="kpis">' +
    kpiCard("Population, " + y, popValue, changeLabel(pop, popPrev, y - 1),
      "World Bank WDI, " + y) +
    kpiCard("Nominal GDP, " + y, "$" + (gdp / 1000).toFixed(2) + ' <small>trillion</small>',
      changeLabel(gdp, gdpPrev, y - 1), "World Bank WDI, " + y) +
    kpiCard("GDP per capita, " + y, fmtUsd(pc),
      changeLabel(pc, pcPrev, y - 1), "World Bank WDI, derived, " + y) +
    kpiCard("Unemployment, " + y, un.toFixed(1) + " <small>%</small>",
      fmtSigned(un - unPrev, 1) + " pts vs " + (y - 1),
      "Statistics Bureau / WDI, " + y) +
    kpiCard("Consumer price inflation, " + y, fmtPct(cpi, 1).replace("+", ""),
      fmtSigned(cpi - cpiPrev, 1) + " pts vs " + (y - 1),
      "World Bank WDI, " + y) +
    kpiCard("Total fertility rate, 2024", DATA.vital2024.fertilityRate.toFixed(2) + " <small>children per woman</small>",
      "1.20 in 2023 — record low", "Ministry of Health, Labour and Welfare, 2024") +
    "</div>";

  html += '<div class="card"><h3>Population, 2015–2025 — still shrinking</h3>' +
    lineChart(DATA.population, {
      label: "Total population of Japan, 2015 to 2025",
      color: "#1e3a5f",
      valueFmt: (v) => fmtMillions(v, 1) + "m",
      tickFmt: (v) => fmtMillions(v, 0) + "m",
    }) +
    '<p class="src">Total population, midyear estimates. Source: World Bank, World Development ' +
    "Indicators (SP.POP.TOTL). Japan peaked at 128.1 million in 2010 and has fallen every year since.</p></div>";

  html += '<div class="card"><h3>Nominal GDP, 2015–2025 — the yen moves the dollar figure</h3>' +
    barChart(DATA.gdpNominalBnUsd, {
      label: "Nominal GDP of Japan in current US dollars, 2015 to 2025",
      color: "#1e3a5f",
      valueFmt: (v) => "$" + fmtBillions(v / 1000, 2) + "tn",
      tickFmt: (v) => "$" + (v / 1000).toFixed(0) + "tn",
    }) +
    '<p class="src">GDP in current US dollars. Source: World Bank, World Development Indicators ' +
    "(NY.GDP.MKTP.CD). In yen the economy grew every year to 2025; in dollars it fell in 2022–2024 " +
    "because the yen weakened, then recovered in 2025.</p></div>";

  html += '<div class="card"><h3>What the numbers say</h3><ul class="findings">' +
    "<li><strong>Japan is shrinking by about half a million people a year.</strong> " +
    "Population fell from 127.1 million (2015) to 123.4 million (2025); births in 2024 " +
    "(686,061) were the fewest since records began in 1899.</li>" +
    "<li><strong>Output is the world's 4th largest, at $4.44 trillion in 2025.</strong> " +
    "Real growth was +1.2% in 2025 after −0.2% in 2024.</li>" +
    "<li><strong>Jobs are plentiful and prices are rising again.</strong> Unemployment has sat " +
    "at 2.5% for two years while consumer prices rose 3.2% in 2025 — the fastest since 2023.</li>" +
    "<li><strong>People concentrate in a few prefectures.</strong> Tokyo alone holds 11.6% of " +
    "the country; Tokyo, Kanagawa, Saitama and Chiba together hold 30.1%.</li>" +
    "</ul></div>";
  return html;
}

// ---------- Population ----------

function renderPopulation() {
  const v = DATA.vital2024;
  let html = "<h2>Population</h2>" +
    '<p class="lede">Japan has lost population every year since 2011. The decline is driven by ' +
    "fewer births and more deaths, not by emigration: the natural decrease in 2024 was a record.</p>" +
    '<div class="card"><h3>Total population, 2015–2025</h3>' +
    lineChart(DATA.population, {
      label: "Total population of Japan, 2015 to 2025",
      color: "#1e3a5f",
      valueFmt: (vv) => fmtMillions(vv, 1) + "m",
      tickFmt: (vv) => fmtMillions(vv, 0) + "m",
    }) +
    '<p class="src">Source: World Bank, World Development Indicators (SP.POP.TOTL), midyear estimates.</p></div>' +
    '<div class="card"><h3>Births, deaths and the natural decrease — 2024</h3>' +
    '<div class="detail">' +
    '<div class="box"><div class="k">Births</div><div class="v">' + fmtInt(v.births) + "</div></div>" +
    '<div class="box"><div class="k">Deaths</div><div class="v">' + fmtInt(v.deaths) + "</div></div>" +
    '<div class="box"><div class="k">Natural change</div><div class="v">' + fmtInt(v.naturalChange) + "</div></div>" +
    '<div class="box"><div class="k">Total fertility rate</div><div class="v">' + v.fertilityRate.toFixed(2) + "</div></div>" +
    "</div>" +
    '<p class="src">Source: Ministry of Health, Labour and Welfare, Vital Statistics 2024. Births fell ' +
    "below 700,000 for the first time since 1899; the fertility rate fell to a record low of 1.15, " +
    "down from 1.20 in 2023. The replacement level is 2.1 children per woman.</p></div>" +
    '<div class="card"><h3>Population by year</h3><div class="table-scroll"><table class="data">' +
    "<thead><tr><th>Year</th><th>Population</th><th>Change vs prior year</th></tr></thead><tbody>";
  for (let i = 0; i < DATA.population.length; i++) {
    const p = DATA.population[i];
    const prev = i > 0 ? DATA.population[i - 1].value : null;
    html += "<tr><td>" + p.year + '</td><td class="num">' + fmtInt(p.value) + "</td><td class=\"num\">" +
      (prev === null ? "—" : changeLabel(p.value, prev, p.year - 1)) + "</td></tr>";
  }
  html += "</tbody></table></div>" +
    '<p class="src">Source: World Bank, World Development Indicators (SP.POP.TOTL).</p></div>' +
    '<div class="note"><strong>Long lives, few children.</strong> Life expectancy is 84.0 years (2023, ' +
    "World Bank) and 92.3% of people live in urban areas (2025). An ageing, urban population with a " +
    "fertility rate of 1.15 is why the total keeps falling even though people live longer.</div>";
  return html;
}

// ---------- Economy ----------

function renderEconomy() {
  if (!state.indicator) state.indicator = "gdp";
  const ind = state.indicator;
  const series = ind === "gdp" ? DATA.gdpNominalBnUsd
    : ind === "pc" ? DATA.gdpNominalBnUsd.map((p) => ({ year: p.year, value: gdpPerCapita(p.year) }))
    : DATA.gdpGrowthPct;
  const titles = {
    gdp: "Nominal GDP, 2015–2025",
    pc: "GDP per capita, 2015–2025",
    growth: "Real GDP growth, 2015–2025",
  };
  const fmts = {
    gdp: (vv) => "$" + fmtBillions(vv / 1000, 2) + "tn",
    pc: (vv) => fmtUsd(vv),
    growth: (vv) => fmtPct(vv, 1),
  };
  const tickFmts = {
    gdp: (vv) => "$" + (vv / 1000).toFixed(0) + "tn",
    pc: (vv) => "$" + Math.round(vv / 1000) + "k",
    growth: (vv) => vv.toFixed(0) + "%",
  };
  const srcs = {
    gdp: "Source: World Bank WDI (NY.GDP.MKTP.CD), current US dollars.",
    pc: "Source: World Bank WDI, nominal GDP divided by total population (computed on this page).",
    growth: "Source: World Bank WDI (NY.GDP.MKTP.KD.ZG), annual % change in constant-price GDP.",
  };

  let html = "<h2>Economy</h2>" +
    '<p class="lede">Japan is the world\u2019s 4th largest economy. Dollar figures move with the ' +
    "yen; real growth and GDP per person tell the steadier story.</p>" +
    '<div class="controls"><div><label>Indicator</label><div class="seg">' +
    '<button type="button" data-econ="gdp" class="' + (ind === "gdp" ? "on" : "") + '">Nominal GDP</button>' +
    '<button type="button" data-econ="pc" class="' + (ind === "pc" ? "on" : "") + '">GDP per capita</button>' +
    '<button type="button" data-econ="growth" class="' + (ind === "growth" ? "on" : "") + '">Real growth</button>' +
    "</div></div></div>" +
    '<div class="card"><h3>' + titles[ind] + "</h3>" +
    barChart(series, {
      label: titles[ind],
      color: ind === "growth" ? "#166534" : "#1e3a5f",
      valueFmt: fmts[ind],
      tickFmt: tickFmts[ind],
      showValues: ind === "growth",
    }) +
    '<p class="src">' + srcs[ind] + "</p></div>" +
    '<div class="card"><h3>Economy by year</h3><div class="table-scroll"><table class="data">' +
    "<thead><tr><th>Year</th><th>Nominal GDP (US$ bn)</th><th>GDP per capita (US$)</th><th>Real growth</th></tr></thead><tbody>";
  for (let i = 0; i < DATA.gdpNominalBnUsd.length; i++) {
    const p = DATA.gdpNominalBnUsd[i];
    html += "<tr><td>" + p.year + '</td><td class="num">' + fmtInt(p.value) + '</td><td class="num">' +
      fmtInt(gdpPerCapita(p.year)) + '</td><td class="num">' + fmtPct(DATA.gdpGrowthPct[i].value, 1) + "</td></tr>";
  }
  html += "</tbody></table></div>" +
    '<p class="src">Sources: World Bank, World Development Indicators (NY.GDP.MKTP.CD, ' +
    "NY.GDP.MKTP.KD.ZG). GDP per capita is nominal GDP divided by total population.</p></div>" +
    '<div class="note"><strong>Read the dollar figure with care.</strong> Nominal GDP in yen rose every ' +
    "year from 2021 to 2025, reaching ¥666.4 trillion in 2025 (Cabinet Office). The dollar figure fell " +
    "in 2022–2024 only because the yen weakened against the dollar; real output barely moved.</div>";
  return html;
}

// ---------- Labour & prices ----------

function renderLabour() {
  if (!state.indicator) state.indicator = "unemp";
  const ind = state.indicator;
  const series = ind === "unemp" ? DATA.unemploymentPct : DATA.cpiInflationPct;
  const isUn = ind === "unemp";
  const title = isUn ? "Unemployment rate, 2015–2025" : "Consumer price inflation, 2018–2025";
  const src = isUn
    ? "Source: World Bank WDI (SL.UEM.TOTL.ZS), modelled ILO estimate; cross-checked with the Statistics Bureau's Labour Force Survey annual averages."
    : "Source: World Bank WDI (FP.CPI.TOTL.ZG), annual % change in consumer prices.";

  let html = "<h2>Labour &amp; prices</h2>" +
    '<p class="lede">Japan combines very low unemployment with, since 2022, the fastest price ' +
    "rises in decades. The two series below use annual averages, not single months.</p>" +
    '<div class="controls"><div><label>Indicator</label><div class="seg">' +
    '<button type="button" data-lab="unemp" class="' + (isUn ? "on" : "") + '">Unemployment</button>' +
    '<button type="button" data-lab="cpi" class="' + (!isUn ? "on" : "") + '">CPI inflation</button>' +
    "</div></div></div>" +
    '<div class="card"><h3>' + title + "</h3>" +
    lineChart(series, {
      label: title,
      color: isUn ? "#1e3a5f" : "#b91c1c",
      valueFmt: (vv) => vv.toFixed(1) + "%",
      tickFmt: (vv) => vv.toFixed(1) + "%",
    }) +
    '<p class="src">' + src + "</p></div>" +
    '<div class="card"><h3>Labour market in 2025</h3><ul class="findings">' +
    "<li><strong>Unemployment averaged 2.5% in 2025</strong>, unchanged from 2024. " +
    "1.76 million people were unemployed out of a labour force of 70.04 million " +
    "(Statistics Bureau, Labour Force Survey 2025 average results).</li>" +
    "<li><strong>Youth unemployment is higher:</strong> 3.8% for ages 15–24 in 2025, " +
    "against 1.9% for ages 65 and over.</li>" +
    "<li><strong>Prices rose 3.2% in 2025</strong>, up from 2.7% in 2024 — the third year " +
    "above 2.5% after three decades near zero.</li>" +
    "</ul></div>" +
    '<div class="card"><h3>Labour &amp; prices by year</h3><div class="table-scroll"><table class="data">' +
    "<thead><tr><th>Year</th><th>Unemployment (%)</th><th>CPI inflation (%)</th></tr></thead><tbody>";
  for (let i = 0; i < DATA.unemploymentPct.length; i++) {
    const p = DATA.unemploymentPct[i];
    const cpi = valueInYear(DATA.cpiInflationPct, p.year);
    html += "<tr><td>" + p.year + '</td><td class="num">' + p.value.toFixed(1) +
      '</td><td class="num">' + (cpi === null ? "—" : cpi.toFixed(1)) + "</td></tr>";
  }
  html += "</tbody></table></div>" +
    '<p class="src">Unemployment: World Bank WDI (SL.UEM.TOTL.ZS). CPI inflation: World Bank WDI ' +
    "(FP.CPI.TOTL.ZG). The CPI series starts in 2018 on this page because earlier years were not " +
    "re-checked for this edition.</p></div>";
  return html;
}

// ---------- Regions ----------

function renderRegions() {
  if (!state.sort) state.sort = "pop";
  if (!state.pref) state.pref = "Tokyo";
  const sort = state.sort;
  const rows = DATA.prefectures.slice();
  if (sort === "pop") rows.sort((a, b) => b.pop2025 - a.pop2025);
  else if (sort === "change") rows.sort((a, b) =>
    ((b.pop2025 - b.pop2020) / b.pop2020) - ((a.pop2025 - a.pop2020) / a.pop2020));
  else rows.sort((a, b) => a.name.localeCompare(b.name));
  const sel = DATA.prefectures.find((p) => p.name === state.pref) || DATA.prefectures[0];
  const share = (sel.pop2025 / 123366734) * 100;
  const chg = ((sel.pop2025 - sel.pop2020) / sel.pop2020) * 100;

  let html = "<h2>Regions</h2>" +
    '<p class="lede">The 2025 census counted Japan\u2019s 47 prefectures. Only Tokyo grew; every other ' +
    "prefecture shrank. The ten largest hold more than half the country.</p>" +
    '<div class="controls">' +
    '<div><label for="rg-sort">Sort the table by</label><select id="rg-sort">' +
    '<option value="pop"' + (sort === "pop" ? " selected" : "") + ">Population, largest first</option>" +
    '<option value="change"' + (sort === "change" ? " selected" : "") + ">Five-year change, best first</option>" +
    '<option value="name"' + (sort === "name" ? " selected" : "") + ">Name, A to Z</option>" +
    "</select></div>" +
    '<div><label for="rg-pref">Prefecture detail</label><select id="rg-pref">' +
    DATA.prefectures.map((p) =>
      '<option value="' + p.name + '"' + (p.name === sel.name ? " selected" : "") + ">" + p.name + "</option>"
    ).join("") +
    "</select></div></div>" +
    '<div class="card"><h3>' + esc(sel.name) + " — capital " + esc(sel.capital) + "</h3>" +
    '<div class="detail">' +
    '<div class="box"><div class="k">Population, 2025</div><div class="v">' + fmtInt(sel.pop2025) + "</div></div>" +
    '<div class="box"><div class="k">Share of Japan</div><div class="v">' + share.toFixed(1) + "%</div></div>" +
    '<div class="box"><div class="k">Change since 2020</div><div class="v">' + fmtPct(chg, 2) + "</div></div>" +
    '<div class="box"><div class="k">Density</div><div class="v">' + fmtInt(sel.density) + " /km²</div></div>" +
    "</div>" +
    '<p class="src">Source: Statistics Bureau of Japan, 2025 Population Census (basic tabulation), ' +
    "reference date 1 October 2025; density is the census figure.</p></div>" +
    '<div class="card"><h3>Ten largest prefectures, 2025</h3>' +
    hbarChart(DATA.prefectures.map((p) => ({ name: p.name, value: p.pop2025 })), {
      label: "Population of the ten largest prefectures, 2025 census",
      valueFmt: (vv) => fmtMillions(vv, 2) + "m",
    }) +
    '<p class="src">Source: Statistics Bureau of Japan, 2025 Population Census.</p></div>' +
    '<div class="card"><h3>Prefecture table — 2025 census vs 2020 census</h3>' +
    '<div class="table-scroll"><table class="data"><thead><tr>' +
    '<th class="sortable" data-sort="name">Prefecture</th>' +
    '<th class="sortable" data-sort="pop">2025</th>' +
    '<th>2020</th><th class="sortable" data-sort="change">Change, %</th><th>Density /km²</th>' +
    "</tr></thead><tbody>";
  for (const p of rows) {
    const c = ((p.pop2025 - p.pop2020) / p.pop2020) * 100;
    html += "<tr><td>" + esc(p.name) + '</td><td class="num">' + fmtInt(p.pop2025) +
      '</td><td class="num">' + fmtInt(p.pop2020) + '</td><td class="num">' + fmtPct(c, 2) +
      '</td><td class="num">' + fmtInt(p.density) + "</td></tr>";
  }
  html += "</tbody></table></div>" +
    '<p class="src">Source: Statistics Bureau of Japan, 2025 Population Census (basic tabulation) ' +
    "and 2020 Population Census. Click a column heading to sort by it. Together, Tokyo, Kanagawa, " +
    "Saitama and Chiba hold 37.0 million people — 30.1% of Japan.</p></div>";
  return html;
}

// ---------- Sources & methods ----------

function renderSources() {
  let html = "<h2>Sources &amp; methods</h2>" +
    '<p class="lede">Every figure on this site names its publisher and year. Nothing here is ' +
    "estimated by this site except GDP per capita, which is a division of two published series.</p>" +
    '<div class="card"><h3>Where each figure comes from</h3><div class="table-scroll"><table class="data">' +
    "<thead><tr><th>Indicator</th><th>Publisher</th><th>Years</th><th>Note</th></tr></thead><tbody>";
  for (const s of DATA.sources) {
    html += "<tr><td>" + esc(s.indicator) + "</td><td>" + esc(s.publisher) + "</td><td>" +
      esc(s.years) + "</td><td>" + esc(s.note) + "</td></tr>";
  }
  html += "</tbody></table></div></div>" +
    '<div class="card"><h3>How to read the numbers</h3><ul class="findings">' +
    "<li><strong>Two population totals differ, and both are right.</strong> The World Bank's " +
    "midyear estimate for 2025 is 123,366,734; the 2025 census counted about 123.0 million on " +
    "1 October 2025. An estimate and a census count on different dates are not the same thing, " +
    "so the site uses the World Bank series for year-to-year trends and the census for prefectures.</li>" +
    "<li><strong>Dollar GDP moves with the exchange rate.</strong> The yen series (Cabinet Office) " +
    "and the dollar series (World Bank) can point in different directions in the same year.</li>" +
    "<li><strong>Annual averages, not single months.</strong> Unemployment and CPI inflation here " +
    "are yearly averages; a single month can look quite different.</li>" +
    "<li><strong>Figures are revised.</strong> Publishers restate past years; the values here are " +
    "as published in the World Bank's 2025–2026 vintage and the 2025 census basic tabulation.</li>" +
    "</ul></div>" +
    '<div class="card"><h3>About this site</h3><p>Nippon Numbers is an independent, original ' +
    "reference site. It is not affiliated with the Statistics Bureau of Japan, the World Bank or " +
    "any government. All text and charts are original; figures are credited to their publishers " +
    "above. The site is a set of static files: it loads nothing from the network and works offline.</p></div>";
  return html;
}

// ---------- Router ----------

const RENDERERS = {
  overview: renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  labour: renderLabour,
  regions: renderRegions,
  sources: renderSources,
};

function render() {
  const route = currentRoute();
  state = {};
  document.querySelectorAll("nav.tabs a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#/" + route);
  });
  document.getElementById("page").innerHTML = RENDERERS[route]();
  bindControls(route);
  window.scrollTo(0, 0);
}

function bindControls(route) {
  const page = document.getElementById("page");
  const yearSel = page.querySelector("#ov-year");
  if (yearSel) yearSel.addEventListener("change", () => {
    state.year = parseInt(yearSel.value, 10);
    document.getElementById("page").innerHTML = renderOverview();
    bindControls(route);
  });
  page.querySelectorAll("[data-popunit]").forEach((b) => b.addEventListener("click", () => {
    state.popUnit = b.getAttribute("data-popunit");
    document.getElementById("page").innerHTML = renderOverview();
    bindControls(route);
  }));
  page.querySelectorAll("[data-econ]").forEach((b) => b.addEventListener("click", () => {
    state.indicator = b.getAttribute("data-econ");
    document.getElementById("page").innerHTML = renderEconomy();
    bindControls(route);
  }));
  page.querySelectorAll("[data-lab]").forEach((b) => b.addEventListener("click", () => {
    state.indicator = b.getAttribute("data-lab");
    document.getElementById("page").innerHTML = renderLabour();
    bindControls(route);
  }));
  const sortSel = page.querySelector("#rg-sort");
  if (sortSel) sortSel.addEventListener("change", () => {
    state.sort = sortSel.value;
    document.getElementById("page").innerHTML = renderRegions();
    bindControls(route);
  });
  const prefSel = page.querySelector("#rg-pref");
  if (prefSel) prefSel.addEventListener("change", () => {
    state.pref = prefSel.value;
    document.getElementById("page").innerHTML = renderRegions();
    bindControls(route);
  });
  page.querySelectorAll("th.sortable").forEach((th) => th.addEventListener("click", () => {
    state.sort = th.getAttribute("data-sort");
    document.getElementById("page").innerHTML = renderRegions();
    bindControls(route);
  }));
}

window.addEventListener("hashchange", render);
render();
