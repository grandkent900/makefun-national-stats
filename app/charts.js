// Hand-drawn inline SVG charts. No library, no framework: each builder
// takes a series of {year, value} points and returns an SVG string with
// axes, gridlines and readable value labels. Every point also carries a
// <title> so the exact figure is available on hover.

function svgEsc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function niceTicks(min, max, count) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const step0 = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(v);
  return ticks;
}

// A line chart with filled area under the line.
function lineChart(series, opts) {
  const o = opts || {};
  const w = o.width || 720, h = o.height || 300;
  const padL = o.padL || 56, padR = o.padR || 14, padT = 16, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const values = series.map((p) => p.value);
  let min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const pad = (max - min) * 0.12 || 1;
  min -= pad; max += pad;
  const x = (i) => padL + (iw * i) / (series.length - 1);
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const ticks = niceTicks(min, max, 4);
  const color = o.color || "#b91c1c";
  let s = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
    svgEsc(o.label || "Line chart") + '">';
  for (const t of ticks) {
    s += '<line x1="' + padL + '" y1="' + y(t).toFixed(1) + '" x2="' + (w - padR) +
      '" y2="' + y(t).toFixed(1) + '" class="grid"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y(t) + 4).toFixed(1) +
      '" class="axis" text-anchor="end">' + svgEsc(o.tickFmt ? o.tickFmt(t) : String(t)) + "</text>";
  }
  const step = Math.max(1, Math.ceil(series.length / 8));
  for (let i = 0; i < series.length; i += step) {
    s += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" class="axis" text-anchor="middle">' +
      series[i].year + "</text>";
  }
  let area = "M " + x(0).toFixed(1) + " " + y(series[0].value).toFixed(1);
  let line = area;
  for (let i = 1; i < series.length; i++) {
    line += " L " + x(i).toFixed(1) + " " + y(series[i].value).toFixed(1);
    area += " L " + x(i).toFixed(1) + " " + y(series[i].value).toFixed(1);
  }
  area += " L " + x(series.length - 1).toFixed(1) + " " + (padT + ih) +
    " L " + x(0).toFixed(1) + " " + (padT + ih) + " Z";
  s += '<path d="' + area + '" fill="' + color + '" fill-opacity="0.10"/>';
  s += '<path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>';
  for (let i = 0; i < series.length; i++) {
    const p = series[i];
    s += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.value).toFixed(1) +
      '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2"><title>' +
      p.year + ": " + svgEsc(o.valueFmt ? o.valueFmt(p.value) : String(p.value)) + "</title></circle>";
  }
  // Label the first and last values so the trend reads without hovering.
  s += '<text x="' + x(0).toFixed(1) + '" y="' + (y(series[0].value) - 10).toFixed(1) +
    '" class="vlabel" text-anchor="middle">' + svgEsc(o.valueFmt ? o.valueFmt(series[0].value) : String(series[0].value)) + "</text>";
  const last = series[series.length - 1];
  s += '<text x="' + (x(series.length - 1) - 2).toFixed(1) + '" y="' + (y(last.value) - 10).toFixed(1) +
    '" class="vlabel" text-anchor="end">' + svgEsc(o.valueFmt ? o.valueFmt(last.value) : String(last.value)) + "</text>";
  return s + "</svg>";
}

// A vertical bar chart. Bars may be negative (drawn below the zero line).
function barChart(series, opts) {
  const o = opts || {};
  const w = o.width || 720, h = o.height || 300;
  const padL = o.padL || 56, padR = o.padR || 14, padT = 26, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const values = series.map((p) => p.value);
  let min = Math.min(0, Math.min.apply(null, values));
  let max = Math.max(0, Math.max.apply(null, values));
  const pad = (max - min) * 0.08 || 1;
  min -= pad; max += pad;
  const slot = iw / series.length;
  const bw = Math.min(46, slot * 0.62);
  const x = (i) => padL + slot * i + (slot - bw) / 2;
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const ticks = niceTicks(min, max, 4);
  const color = o.color || "#1e3a5f";
  let s = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
    svgEsc(o.label || "Bar chart") + '">';
  for (const t of ticks) {
    s += '<line x1="' + padL + '" y1="' + y(t).toFixed(1) + '" x2="' + (w - padR) +
      '" y2="' + y(t).toFixed(1) + '" class="grid"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y(t) + 4).toFixed(1) +
      '" class="axis" text-anchor="end">' + svgEsc(o.tickFmt ? o.tickFmt(t) : String(t)) + "</text>";
  }
  s += '<line x1="' + padL + '" y1="' + y(0).toFixed(1) + '" x2="' + (w - padR) +
    '" y2="' + y(0).toFixed(1) + '" class="zero"/>';
  for (let i = 0; i < series.length; i++) {
    const p = series[i];
    const top = Math.min(y(p.value), y(0));
    const ht = Math.abs(y(p.value) - y(0));
    const fill = p.value < 0 ? "#b91c1c" : color;
    s += '<rect x="' + x(i).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) +
      '" height="' + Math.max(ht, 1).toFixed(1) + '" rx="2" fill="' + fill + '"><title>' +
      p.year + ": " + svgEsc(o.valueFmt ? o.valueFmt(p.value) : String(p.value)) + "</title></rect>";
    s += '<text x="' + (x(i) + bw / 2).toFixed(1) + '" y="' + (h - 10) + '" class="axis" text-anchor="middle">' +
      p.year + "</text>";
    if (o.showValues) {
      const ly = p.value < 0 ? y(p.value) + 14 : y(p.value) - 6;
      s += '<text x="' + (x(i) + bw / 2).toFixed(1) + '" y="' + ly.toFixed(1) +
        '" class="vlabel-sm" text-anchor="middle">' + svgEsc(o.valueFmt ? o.valueFmt(p.value) : String(p.value)) + "</text>";
    }
  }
  return s + "</svg>";
}

// A horizontal bar chart for ranked lists (prefectures).
function hbarChart(items, opts) {
  const o = opts || {};
  const rowH = o.rowH || 34, padL = o.padL || 92, padR = o.padR || 74, padT = 8, padB = 8;
  const w = o.width || 720;
  const h = padT + padB + items.length * rowH;
  const max = Math.max.apply(null, items.map((p) => p.value));
  const iw = w - padL - padR;
  const color = o.color || "#1e3a5f";
  let s = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
    svgEsc(o.label || "Horizontal bar chart") + '">';
  items.forEach((p, i) => {
    const y = padT + i * rowH;
    const bw = Math.max(2, (p.value / max) * iw);
    s += '<text x="' + (padL - 8) + '" y="' + (y + rowH / 2 + 4) + '" class="axis" text-anchor="end">' +
      svgEsc(p.name) + "</text>";
    s += '<rect x="' + padL + '" y="' + (y + 6) + '" width="' + bw.toFixed(1) +
      '" height="' + (rowH - 12) + '" rx="3" fill="' + (i === 0 ? "#b91c1c" : color) + '"><title>' +
      svgEsc(p.name) + ": " + svgEsc(o.valueFmt ? o.valueFmt(p.value) : String(p.value)) + "</title></rect>";
    s += '<text x="' + (padL + bw + 8).toFixed(1) + '" y="' + (y + rowH / 2 + 4) +
      '" class="vlabel-sm">' + svgEsc(o.valueFmt ? o.valueFmt(p.value) : String(p.value)) + "</text>";
  });
  return s + "</svg>";
}
