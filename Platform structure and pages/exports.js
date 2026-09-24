/* Download helpers: [data-export="csv|pdf"] inside a [data-export-card] exports its grid table;
   [data-chart-download] saves the Highcharts chart in the element matching that selector as PNG. */
(function () {
  if (window.__qodeExports) return;
  window.__qodeExports = true;

  function gridRows(card) {
    var grids = Array.prototype.filter.call(card.querySelectorAll('div'), function (d) {
      return d.style.display === 'grid' && d.children.length > 2;
    });
    return grids.map(function (g) {
      return Array.prototype.map.call(g.children, function (c) { return c.innerText.replace(/\s+/g, ' ').trim(); });
    });
  }

  function save(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function csv(rows, name) {
    var text = rows.map(function (r) {
      return r.map(function (v) { return '"' + v.replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');
    save(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }), name + '.csv');
  }

  function pdf(rows, name) {
    var w = window.open('', '_blank');
    if (!w) return;
    var esc = function (v) { return v.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var body = rows.map(function (r, i) {
      var tag = i === 0 ? 'th' : 'td';
      return '<tr>' + r.map(function (v, j) { return '<' + tag + (j > 1 ? ' class="n"' : '') + '>' + esc(v) + '</' + tag + '>'; }).join('') + '</tr>';
    }).join('');
    w.document.write('<!doctype html><title>' + esc(name) + '</title><style>' +
      'body{font:12px Lato,Arial,sans-serif;color:#111827;margin:24px}h1{font:600 18px Georgia,serif;color:#002017;margin:0 0 4px}' +
      'p{margin:0 0 16px;color:#626567}table{border-collapse:collapse;width:100%}th{background:#eee;text-transform:uppercase;font-size:11px;letter-spacing:.05em;text-align:left}' +
      'th,td{padding:7px 8px;border-bottom:1px solid #ddd}.n{text-align:right}</style>' +
      '<h1>' + esc(name) + '</h1><p>Qode Algo Platform &middot; ' + new Date().toLocaleString('en-IN') + '</p><table>' + body + '</table>');
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 300);
  }

  function chartPng(sel, name) {
    var svg = document.querySelector(sel + ' svg.highcharts-root');
    if (!svg) return;
    var box = svg.getBoundingClientRect();
    var clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', box.width);
    clone.setAttribute('height', box.height);
    var img = new Image();
    img.onload = function () {
      var k = 2, c = document.createElement('canvas');
      c.width = box.width * k; c.height = box.height * k;
      var x = c.getContext('2d');
      x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(function (b) { save(b, name + '.png'); }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  }

  function xls(rows, name) {
    var esc = function (v) { return v.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var body = rows.map(function (r, i) {
      return '<tr>' + r.map(function (v) { return (i ? '<td>' : '<th>') + esc(v) + (i ? '</td>' : '</th>'); }).join('') + '</tr>';
    }).join('');
    var html = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">' + body + '</table></body></html>';
    save(new Blob(['﻿' + html], { type: 'application/vnd.ms-excel' }), name + '.xls');
  }

  function closeMenus(except) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-dl-menu]'), function (m) { if (m !== except) m.style.display = 'none'; });
  }
  window.addEventListener('scroll', function () { closeMenus(); }, true);

  document.addEventListener('click', function (e) {
    var tg = e.target.closest && e.target.closest('[data-dl-toggle]');
    if (tg) {
      var m = tg.parentNode.querySelector('[data-dl-menu]');
      var open = m.style.display === 'block';
      closeMenus();
      if (!open) {
        var r = tg.getBoundingClientRect();
        m.style.display = 'block';
        m.style.top = r.bottom + 4 + 'px';
        m.style.left = Math.max(8, r.right - m.offsetWidth) + 'px';
      }
      return;
    }
    if (!(e.target.closest && e.target.closest('[data-report-dl]'))) closeMenus();
    var rb = e.target.closest && e.target.closest('[data-report-dl]');
    if (rb) {
      var row = rb.closest('[data-dl-menu]').parentNode.parentNode;
      rb.closest('[data-dl-menu]').style.display = 'none';
      var c = Array.prototype.map.call(row.children, function (x) { return x.innerText.replace(/\s+/g, ' ').trim(); });
      var data = [['Report', 'Period', 'Generated on'], [c[0], c[1], c[2]]];
      var base = c[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'report';
      var kind = rb.getAttribute('data-report-dl');
      if (kind === 'csv') csv(data, base); else if (kind === 'xls') xls(data, base); else pdf(data, c[0]);
      return;
    }
    var b = e.target.closest && e.target.closest('[data-export],[data-chart-download]');
    if (!b) return;
    var stamp = new Date().toISOString().slice(0, 10);
    if (b.hasAttribute('data-chart-download')) return chartPng(b.getAttribute('data-chart-download'), (b.getAttribute('data-name') || 'nav-chart') + '-' + stamp);
    var card = b.closest('[data-export-card]');
    if (!card) return;
    var rows = gridRows(card);
    if (!rows.length) return;
    var name = card.getAttribute('data-export-card') || 'table';
    if (b.getAttribute('data-export') === 'csv') csv(rows, name + '-' + stamp); else pdf(rows, name);
  });
})();
