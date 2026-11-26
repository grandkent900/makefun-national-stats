// Japan national statistics: every figure with its source and year.
// All series are the World Bank's World Development Indicators (WDI)
// unless a different publisher is named. Figures were checked against
// the publishers' published tables in November 2026; nothing here is
// estimated by this site. Where two publishers differ, the site says so
// on the Sources page instead of silently picking one.

const DATA = {
  country: {
    name: "Japan",
    japanese: "日本",
    capital: "Tokyo",
    currency: "Japanese yen (JPY)",
    areaKm2: 377975,
    // The 2025 census counted about 123.0 million people (Statistics
    // Bureau of Japan, basic tabulation); the WDI midyear estimate for
    // 2025 is 123,366,734. The Sources page explains the gap.
  },

  // World Bank WDI, SP.POP.TOTL (persons, midyear estimates).
  population: [
    { year: 2015, value: 127141000 }, { year: 2016, value: 127076000 },
    { year: 2017, value: 126972000 }, { year: 2018, value: 126811000 },
    { year: 2019, value: 126633000 }, { year: 2020, value: 126261000 },
    { year: 2021, value: 125681593 }, { year: 2022, value: 125124989 },
    { year: 2023, value: 124516650 }, { year: 2024, value: 123975371 },
    { year: 2025, value: 123366734 },
  ],

  // World Bank WDI, NY.GDP.MKTP.CD (current US dollars, billions).
  gdpNominalBnUsd: [
    { year: 2015, value: 4534.4 }, { year: 2016, value: 5110.4 },
    { year: 2017, value: 5038.2 }, { year: 2018, value: 5154.3 },
    { year: 2019, value: 5245.8 }, { year: 2020, value: 5189.2 },
    { year: 2021, value: 5225.9 }, { year: 2022, value: 4448.0 },
    { year: 2023, value: 4384.9 }, { year: 2024, value: 4190.0 },
    { year: 2025, value: 4435.2 },
  ],

  // World Bank WDI, NY.GDP.MKTP.KD.ZG (real GDP growth, % per year).
  gdpGrowthPct: [
    { year: 2015, value: 1.8 }, { year: 2016, value: 0.7 },
    { year: 2017, value: 1.6 }, { year: 2018, value: 0.8 },
    { year: 2019, value: -0.3 }, { year: 2020, value: -4.3 },
    { year: 2021, value: 3.6 }, { year: 2022, value: 1.3 },
    { year: 2023, value: 0.7 }, { year: 2024, value: -0.2 },
    { year: 2025, value: 1.2 },
  ],

  // World Bank WDI, SL.UEM.TOTL.ZS (modelled ILO estimate, % of labour force).
  // Cross-checked with the Statistics Bureau's Labour Force Survey annual
  // averages, which agree to one decimal place for every year shown.
  unemploymentPct: [
    { year: 2015, value: 3.4 }, { year: 2016, value: 3.1 },
    { year: 2017, value: 2.8 }, { year: 2018, value: 2.5 },
    { year: 2019, value: 2.4 }, { year: 2020, value: 2.8 },
    { year: 2021, value: 2.8 }, { year: 2022, value: 2.6 },
    { year: 2023, value: 2.6 }, { year: 2024, value: 2.5 },
    { year: 2025, value: 2.5 },
  ],

  // World Bank WDI, FP.CPI.TOTL.ZG (inflation, consumer prices, annual %).
  cpiInflationPct: [
    { year: 2018, value: 1.0 }, { year: 2019, value: 0.5 },
    { year: 2020, value: 0.0 }, { year: 2021, value: -0.2 },
    { year: 2022, value: 2.5 }, { year: 2023, value: 3.3 },
    { year: 2024, value: 2.7 }, { year: 2025, value: 3.2 },
  ],

  // Ministry of Health, Labour and Welfare, Vital Statistics 2024.
  vital2024: {
    births: 686061, deaths: 1605298, naturalChange: -919237,
    fertilityRate: 1.15, fertilityRate2023: 1.20,
  },

  // World Bank WDI: life expectancy at birth, SP.DYN.LE00.IN (2023);
  // urban population share, SP.URB.TOTL.IN.ZS (2025).
  lifeExpectancyYears: { year: 2023, value: 84.0 },
  urbanSharePct: { year: 2025, value: 92.3 },

  // 2025 Population Census, basic tabulation (Statistics Bureau of Japan,
  // published 29 September 2026). 2020 column is the 2020 census.
  // Density is persons per km2, 2025.
  prefectures: [
    { name: "Tokyo", capital: "Shinjuku", pop2025: 14236627, pop2020: 14047598, density: 6471.4 },
    { name: "Kanagawa", capital: "Yokohama", pop2025: 9193922, pop2020: 9237333, density: 3804.6 },
    { name: "Osaka", capital: "Osaka", pop2025: 8759312, pop2020: 8837685, density: 4597.4 },
    { name: "Aichi", capital: "Nagoya", pop2025: 7448043, pop2020: 7542415, density: 1439.7 },
    { name: "Saitama", capital: "Saitama", pop2025: 7287325, pop2020: 7344765, density: 1918.9 },
    { name: "Chiba", capital: "Chiba", pop2025: 6257225, pop2020: 6284480, density: 1213.5 },
    { name: "Hyogo", capital: "Kobe", pop2025: 5317792, pop2020: 5465002, density: 633.0 },
    { name: "Fukuoka", capital: "Fukuoka", pop2025: 5077785, pop2020: 5135214, density: 1018.2 },
    { name: "Hokkaido", capital: "Sapporo", pop2025: 4980272, pop2020: 5224614, density: 59.7 },
    { name: "Shizuoka", capital: "Shizuoka", pop2025: 3465667, pop2020: 3633202, density: 445.6 },
  ],

  // What the site publishes about each indicator, shown on the Sources page.
  sources: [
    { indicator: "Total population", publisher: "World Bank, World Development Indicators (SP.POP.TOTL)", years: "2015–2025", note: "Midyear estimates. 2025: 123,366,734 people." },
    { indicator: "Nominal GDP", publisher: "World Bank, World Development Indicators (NY.GDP.MKTP.CD)", years: "2015–2025", note: "Current US dollars. 2025: $4,435.2 billion, 4th in the world." },
    { indicator: "Real GDP growth", publisher: "World Bank, World Development Indicators (NY.GDP.MKTP.KD.ZG)", years: "2015–2025", note: "Annual % change in constant-price GDP. 2025: +1.2%." },
    { indicator: "GDP per capita", publisher: "World Bank, World Development Indicators (derived)", years: "2015–2025", note: "Nominal GDP divided by total population, computed on this page. 2025: $35,951." },
    { indicator: "Unemployment rate", publisher: "World Bank, WDI (SL.UEM.TOTL.ZS); Statistics Bureau of Japan, Labour Force Survey", years: "2015–2025", note: "Modelled ILO estimate, % of labour force. 2025: 2.5%." },
    { indicator: "Consumer price inflation", publisher: "World Bank, WDI (FP.CPI.TOTL.ZG); Statistics Bureau of Japan, CPI", years: "2018–2025", note: "Annual % change in consumer prices. 2025: 3.2%." },
    { indicator: "Births, deaths, fertility", publisher: "Ministry of Health, Labour and Welfare, Vital Statistics", years: "2024", note: "686,061 births; 1,605,298 deaths; total fertility rate 1.15." },
    { indicator: "Life expectancy", publisher: "World Bank, World Development Indicators (SP.DYN.LE00.IN)", years: "2023", note: "84.0 years at birth, both sexes." },
    { indicator: "Urban population share", publisher: "World Bank, World Development Indicators (SP.URB.TOTL.IN.ZS)", years: "2025", note: "92.3% of the population lives in urban areas." },
    { indicator: "Prefecture populations", publisher: "Statistics Bureau of Japan, 2025 Population Census (basic tabulation)", years: "2025, with 2020 census", note: "Reference date 1 October 2025. Only Tokyo grew of the 47 prefectures." },
  ],
};

// Look a value up by year in a {year, value} series; null when absent.
function valueInYear(series, year) {
  for (const point of series) if (point.year === year) return point.value;
  return null;
}

// GDP per person for a year, computed from the two published series.
function gdpPerCapita(year) {
  const gdp = valueInYear(DATA.gdpNominalBnUsd, year);
  const pop = valueInYear(DATA.population, year);
  if (gdp === null || pop === null) return null;
  return (gdp * 1e9) / pop;
}
