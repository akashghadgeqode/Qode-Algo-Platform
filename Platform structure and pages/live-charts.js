/* Strategy vs Benchmark charts for the algo detail pages (vanilla JS + Highcharts, dummy data).
   Mounts into any <div data-live-chart="equity|drawdown|roll-ret|roll-dd"> and wires <button data-live-reset="equity|drawdown">. */
(function () {
  var HC_URL = 'https://cdn.jsdelivr.net/npm/highcharts@12.6.0/highcharts.js';
  var STRATEGY = '#02422B';
  var BENCH = '#2563eb';
  var BENCH_NAME = 'NIFTY 50';
  var INK = 'rgba(2, 66, 43, ';

  function rng(seed) {
    var a = seed;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildData(seed) {
    var rand = rng(seed);
    var gauss = function () { return (rand() + rand() + rand() + rand() - 2) * 1.7; };
    var d = new Date(Date.UTC(2020, 0, 1));
    var end = Date.UTC(2026, 8, 20);
    var s = 100, b = 100, sPeak = 100, bPeak = 100, drift = 0;
    var out = { equity: [[], []], dd: [[], []] };
    while (d.getTime() <= end) {
      var day = d.getUTCDay();
      if (day !== 0 && day !== 6) {
        var t = d.getTime();
        var yr = (t - Date.UTC(2020, 0, 1)) / 31557600000;
        drift = yr > 2.1 && yr < 2.5 ? -0.0035 : yr > 4.9 && yr < 5.2 ? -0.003 : 0.0009;
        s *= 1 + drift + gauss() * 0.0042;
        b *= 1 + (yr > 0.2 && yr < 0.4 ? -0.0028 : 0.00068) + gauss() * 0.0068;
        sPeak = Math.max(sPeak, s); bPeak = Math.max(bPeak, b);
        out.equity[0].push([t, s]);
        out.equity[1].push([t, b]);
        out.dd[0].push([t, Math.abs((s - sPeak) / sPeak) * 100]);
        out.dd[1].push([t, Math.abs((b - bPeak) / bPeak) * 100]);
      }
      d.setUTCDate(d.getUTCDate() + 1);
    }
    return out;
  }

  var DATA = null;
  function data() { return DATA || (DATA = buildData(20260924)); }

  function fmt(v) { return v == null ? '—' : Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }); }
  function iso(ms) { return new Date(ms).toISOString().slice(0, 10); }

  function css() {
    if (document.getElementById('live-charts-css')) return;
    var s = document.createElement('style');
    s.id = 'live-charts-css';
    s.textContent =
      '.lc-wrap{position:relative;width:100%}' +
      '.lc-wrap .highcharts-reset-zoom{display:none}' +
      '.lc-tip{position:absolute;z-index:10;pointer-events:none;min-width:180px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.95);color:#02422B;box-shadow:0 10px 24px rgba(0,0,0,.15);font:400 12px Lato,sans-serif;border:1px solid rgba(2,66,43,.12);display:none}' +
      '.lc-tip .d{font-weight:700;margin-bottom:6px;color:rgba(2,66,43,.78)}' +
      '.lc-tip .r{display:flex;align-items:center;gap:8px;line-height:1.2;margin-top:4px}' +
      '.lc-tip .dot{width:8px;height:8px;border-radius:999px;flex-shrink:0}' +
      '.lc-tip .l{color:rgba(2,66,43,.6);flex:1}' +
      '.lc-tip .v{font-weight:600;font-size:13px;font-variant-numeric:tabular-nums}' +
      '.lc-tip .hr{height:1px;background:rgba(2,66,43,.12);margin:6px 0}' +
      '.lc-legend{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:10px;padding-top:8px}' +
      '.lc-legend span.i{display:inline-flex;align-items:center;gap:7px;font:700 12px Lato,sans-serif;color:rgba(2,66,43,.78);cursor:pointer;user-select:none;transition:opacity .15s}' +
      '.lc-legend span.i:hover{opacity:.7}.lc-legend span.i.off{opacity:.3}' +
      '.lc-legend .ln{width:22px;height:3px;border-radius:2px;flex-shrink:0}' +
      '.lc-legend .ln.b{background:repeating-linear-gradient(90deg,' + BENCH + ' 0 5px,transparent 5px 9px)}';
    document.head.appendChild(s);
  }

  var axisBase = function (title, extra) {
    var y = {
      title: { text: title, style: { color: INK + '0.55)' } },
      labels: { style: { color: INK + '0.6)' } },
      gridLineColor: INK + '0.08)'
    };
    for (var k in extra) y[k] = extra[k];
    return y;
  };

  function mountRoll(el) {
    el.setAttribute('data-lc-ready', '1');
    var isRet = el.getAttribute('data-live-chart') === 'roll-ret';
    var vals = [];
    try { vals = JSON.parse(el.getAttribute('data-vals') || '[]'); } catch (e) {}
    var names = isRet ? ['Avg', 'Best', 'Worst'] : ['Avg', 'Mildest', 'Deepest'];
    var colors = isRet ? ['#02422B', '#15a36a', '#8aab9a'] : ['#b3403a', '#d99692', '#8a2e29'];
    el.innerHTML = '';
    var box = document.createElement('div');
    el.appendChild(box);
    var label = { style: { color: INK + '0.6)' }, format: '{value:.2f}%' };
    el.__lc = Highcharts.chart(box, {
      chart: { type: 'column', height: 360, animation: false, backgroundColor: 'rgba(255,255,255,0)', style: { fontFamily: 'Lato, sans-serif' } },
      title: { text: undefined }, credits: { enabled: false },
      xAxis: { categories: ['1 Year', '3 Year', '5 Year'], labels: { style: { color: INK + '0.78)' } }, lineColor: INK + '0.18)', tickColor: INK + '0.18)' },
      yAxis: isRet
        ? { title: { text: 'Return (%)', style: { color: INK + '0.55)' } }, labels: label, gridLineColor: INK + '0.08)' }
        : { title: { text: 'Drawdown (%)', style: { color: INK + '0.55)' } }, labels: label, gridLineColor: INK + '0.08)', max: 0 },
      legend: { itemStyle: { color: INK + '0.78)', fontWeight: '700' }, itemHoverStyle: { color: '#02422B' } },
      tooltip: { shared: true, backgroundColor: '#ffffff', borderColor: INK + '0.12)', style: { color: '#02422B' }, valueDecimals: 2, valueSuffix: '%' },
      plotOptions: { column: { grouping: true, borderRadius: 2, pointPadding: 0.05, animation: false,
        dataLabels: { enabled: true, format: '{y:.2f}%', style: { fontSize: '11px', fontWeight: '700', color: '#02422B', textOutline: '2px rgba(252,249,235,0.9)' } } } },
      series: names.map(function (n, i) {
        return { type: 'column', name: n, color: colors[i], data: vals.map(function (p) { return p[i]; }) };
      })
    });
  }

  function mountPortfolio(el) {
    el.setAttribute('data-lc-ready', '1');
    var d = data();
    var neg = function (arr) { return arr.map(function (p) { return [p[0], -p[1]]; }); };
    var GREEN = '#2E8B57', BLUE = '#4169E1', RED = '#FF4560', AMBER = '#FF8F00';
    var axisText = { color: GREEN, fontSize: '12px' };
    var box = document.createElement('div');
    el.innerHTML = '';
    el.appendChild(box);
    el.__lc = Highcharts.chart(box, {
      chart: { zooming: { type: 'xy' }, height: 600, animation: false, backgroundColor: 'transparent', plotBackgroundColor: 'transparent', style: { fontFamily: 'Lato, sans-serif' } },
      title: { text: '' }, credits: { enabled: false },
      xAxis: { type: 'datetime', title: { text: 'Date', style: axisText }, labels: { format: '{value:%d-%m-%Y}', style: axisText }, gridLineColor: '#e6e6e6', tickWidth: 1, lineColor: GREEN },
      yAxis: [
        { title: { text: 'Performance', style: axisText }, height: '60%', top: '0%', labels: { style: axisText, formatter: function () { return Math.round(this.value * 100) / 100 + ''; } },
          lineColor: GREEN, tickColor: GREEN, tickWidth: 1, gridLineColor: '#e6e6e6',
          plotLines: [{ value: 100, color: GREEN, width: 1, zIndex: 5, dashStyle: 'Dot' }] },
        { title: { text: 'Drawdown', style: { color: RED, fontSize: '12px' } }, height: '20%', top: '75%', offset: 0, max: 0,
          labels: { style: { color: RED, fontSize: '12px' }, formatter: function () { return Math.round(this.value * 100) / 100 + '%'; } },
          lineColor: RED, tickColor: RED, tickWidth: 1, gridLineColor: '#e6e6e6' }
      ],
      tooltip: {
        shared: true, useHTML: true, backgroundColor: '#ffffff', borderColor: GREEN,
        style: { fontFamily: 'Lato, sans-serif' },
        formatter: function () {
          var by = {};
          this.points.forEach(function (p) { by[p.series.name] = p.y; });
          var dot = function (c) { return '<span style="color:' + c + '">●</span> '; };
          var v = function (x) { return x == null ? 'N/A' : x.toFixed(2); };
          return '<b>' + Highcharts.dateFormat('%d-%m-%Y', this.x) + '</b><br/><br/>' +
            '<b style="font-size:12px">Performance:</b><br/>' + dot(GREEN) + 'Portfolio: ' + v(by['Portfolio']) + '<br/>' + dot(BLUE) + 'Benchmark: ' + v(by['Nifty 50']) + '<br/><br/>' +
            '<b style="font-size:12px">Drawdown:</b><br/>' + dot(RED) + 'Portfolio: ' + v(by['Portfolio Drawdown']) + '%<br/>' + dot(AMBER) + 'Benchmark: ' + v(by['Nifty 50 Drawdown']) + '%';
        }
      },
      legend: { enabled: true, layout: 'horizontal', align: 'center', verticalAlign: 'bottom', itemStyle: { fontSize: '12px', color: GREEN } },
      plotOptions: { line: { marker: { enabled: false } }, area: { fillOpacity: 0.2, marker: { enabled: false } }, series: { animation: false } },
      series: [
        { name: 'Portfolio', type: 'line', data: d.equity[0], color: GREEN, zIndex: 2, yAxis: 0 },
        { name: 'Nifty 50', type: 'line', data: d.equity[1], color: BLUE, zIndex: 1, yAxis: 0 },
        { name: 'Portfolio Drawdown', type: 'area', data: neg(d.dd[0]), color: RED, zIndex: 2, yAxis: 1, threshold: 0, tooltip: { valueSuffix: '%' } },
        { name: 'Nifty 50 Drawdown', type: 'area', data: neg(d.dd[1]), color: AMBER, zIndex: 1, yAxis: 1, threshold: 0, tooltip: { valueSuffix: '%' } }
      ]
    });
  }

  function mount(el) {
    if (el.getAttribute('data-lc-ready')) return;
    if (el.getAttribute('data-live-chart') === 'portfolio') return mountPortfolio(el);
    if (el.getAttribute('data-live-chart').indexOf('roll') === 0) return mountRoll(el);
    el.setAttribute('data-lc-ready', '1');
    var kind = el.getAttribute('data-live-chart');
    var isEq = kind === 'equity';
    var d = data();
    var series = isEq ? d.equity : d.dd;
    el.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'lc-wrap';
    var box = document.createElement('div');
    var tip = document.createElement('div'); tip.className = 'lc-tip';
    wrap.appendChild(box); wrap.appendChild(tip);
    var legend = document.createElement('div'); legend.className = 'lc-legend';
    el.appendChild(wrap); el.appendChild(legend);

    var zoomed = false;
    var resetBtn = document.querySelector('[data-live-reset="' + kind + '"]');
    function setReset(z) {
      zoomed = z;
      if (resetBtn) { resetBtn.disabled = !z; resetBtn.style.opacity = z ? '1' : '0.35'; resetBtn.style.cursor = z ? 'pointer' : 'not-allowed'; }
    }
    setReset(false);

    var chart = Highcharts.chart(box, {
      chart: {
        height: 300, animation: false, backgroundColor: 'rgba(255,255,255,0)', spacing: [12, 12, 12, 12],
        style: { fontFamily: "Lato, sans-serif" },
        zooming: { type: 'x' },
        events: { selection: function (e) { if (e.xAxis) setReset(true); } }
      },
      title: { text: undefined }, credits: { enabled: false }, legend: { enabled: false }, tooltip: { enabled: false },
      xAxis: {
        type: 'datetime',
        crosshair: { width: 1, color: INK + '0.35)', dashStyle: 'ShortDot' },
        title: { text: 'Date', style: { color: INK + '0.55)' } },
        labels: { style: { color: INK + '0.6)' } },
        lineColor: INK + '0.18)', tickColor: INK + '0.18)'
      },
      yAxis: isEq
        ? axisBase('Equity', { labels: { style: { color: INK + '0.6)' }, formatter: function () { return this.value.toLocaleString(); } } })
        : axisBase('Drawdown %', { reversed: true, labels: { style: { color: INK + '0.6)' }, formatter: function () { return this.value + '%'; } } }),
      plotOptions: { series: { animation: false, marker: { enabled: false } }, spline: { lineWidth: 2 }, areaspline: { lineWidth: 1.2 } },
      series: isEq
        ? [
          { type: 'spline', name: 'Strategy', data: series[0], color: STRATEGY, lineWidth: 2.5 },
          { type: 'spline', name: BENCH_NAME, data: series[1], color: BENCH, lineWidth: 1.8, dashStyle: 'ShortDash' }
        ]
        : [
          { type: 'areaspline', name: 'Strategy DD', data: series[0], color: STRATEGY, fillColor: STRATEGY + '1A', lineWidth: 1.8, threshold: 0 },
          { type: 'areaspline', name: BENCH_NAME + ' DD', data: series[1], color: BENCH, fillColor: 'rgba(37,99,235,0.06)', lineWidth: 1.2, dashStyle: 'ShortDash', threshold: 0 }
        ]
    });

    [[0, 'Strategy' + (isEq ? '' : ' DD'), STRATEGY, false], [1, BENCH_NAME + (isEq ? '' : ' DD'), BENCH, true]].forEach(function (s) {
      var item = document.createElement('span'); item.className = 'i';
      item.innerHTML = '<span class="ln' + (s[3] ? ' b' : '') + '"' + (s[3] ? '' : ' style="background:' + s[2] + '"') + '></span>' + s[1];
      item.onclick = function () {
        var ser = chart.series[s[0]];
        ser.setVisible(!ser.visible, true);
        item.classList.toggle('off', !ser.visible);
      };
      legend.appendChild(item);
    });

    box.addEventListener('mousemove', function (e) {
      var norm = chart.pointer.normalize(e);
      var sS = chart.series[0], bS = chart.series[1];
      if (!sS.visible) { tip.style.display = 'none'; return; }
      var sP = sS.searchPoint(norm, true);
      if (!sP || sP.x == null) { tip.style.display = 'none'; chart.xAxis[0].hideCrosshair(); return; }
      var bP = bS.searchPoint(norm, true);
      var sv = sP.y, bv = bP ? bP.y : 0;
      var html = '<div class="d">' + iso(sP.x) + '</div>' +
        '<div class="r"><span class="dot" style="background:' + STRATEGY + '"></span><span class="l">Strategy</span><span class="v">' + fmt(sv) + (isEq ? '' : '%') + '</span></div>' +
        '<div class="r"><span class="dot" style="background:' + BENCH + '"></span><span class="l">' + BENCH_NAME + '</span><span class="v">' + fmt(bv) + (isEq ? '' : '%') + '</span></div>';
      if (isEq) {
        var diff = sv - bv;
        html += '<div class="hr"></div><div class="r"><span class="dot" style="background:#f59e0b"></span><span class="l">Excess</span><span class="v" style="color:' + (diff >= 0 ? '#02422B' : '#b3403a') + '">' + (diff >= 0 ? '+' : '') + fmt(diff) + '</span></div>';
      }
      tip.innerHTML = html;
      var rect = wrap.getBoundingClientRect();
      var tx = e.clientX - rect.left + 14, ty = e.clientY - rect.top + 14;
      if (tx + 200 > rect.width) tx = e.clientX - rect.left - 214;
      if (ty + (isEq ? 135 : 110) > rect.height) ty = e.clientY - rect.top - (isEq ? 149 : 124);
      tip.style.left = Math.max(0, tx) + 'px'; tip.style.top = Math.max(0, ty) + 'px';
      tip.style.display = 'block';
      chart.xAxis[0].drawCrosshair(norm, sP);
    });
    box.addEventListener('mouseleave', function () { tip.style.display = 'none'; chart.xAxis[0].hideCrosshair(); });

    if (resetBtn) resetBtn.onclick = function () { chart.zoomOut(); setReset(false); };
    el.__lc = chart;
  }

  function scan() {
    if (!window.Highcharts) return;
    var els = document.querySelectorAll('[data-live-chart]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getAttribute('data-lc-ready') && el.__lc && !el.contains(el.__lc.container)) { el.removeAttribute('data-lc-ready'); }
      mount(el);
    }
  }

  var started = false;
  window.QodeLiveCharts = {
    init: function () {
      if (started) return; started = true;
      css();
      var go = function () { scan(); setInterval(scan, 400); };
      if (window.Highcharts) return go();
      var s = document.createElement('script'); s.src = HC_URL; s.onload = go; document.head.appendChild(s);
    }
  };
})();
