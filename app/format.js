// Number formatting for the site's figures. Every formatter is pure and
// locale-independent, so the same input always renders the same text.

function fmtInt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmtMillions(n, decimals) {
  const d = decimals === undefined ? 2 : decimals;
  return (n / 1e6).toFixed(d);
}

function fmtBillions(n, decimals) {
  const d = decimals === undefined ? 1 : decimals;
  return (n).toFixed(d);
}

function fmtUsd(n) {
  return "$" + fmtInt(n);
}

function fmtPct(n, decimals) {
  const d = decimals === undefined ? 1 : decimals;
  const sign = n > 0 ? "+" : "";
  return sign + n.toFixed(d) + "%";
}

function fmtSigned(n, decimals) {
  const d = decimals === undefined ? 1 : decimals;
  const sign = n > 0 ? "+" : "";
  return sign + n.toFixed(d);
}

// Year-on-year change between two yearly values, in percent.
function yoyPct(now, before) {
  if (before === null || before === 0) return null;
  return ((now - before) / Math.abs(before)) * 100;
}

// Short English label for a change, e.g. "-0.5% vs 2024".
function changeLabel(now, before, year) {
  const pct = yoyPct(now, before);
  if (pct === null) return "—";
  return fmtPct(pct) + " vs " + year;
}
