var RA = (function () {
  var DEF = { company: "", cur: "₹", gst: 18 };
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function money(v) { return (Math.round(v * 100) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function uid() { return "r" + Math.random().toString(36).slice(2, 9); }
  function settings() { var s = get("ra.settings", {}); for (var k in DEF) if (s[k] == null) s[k] = DEF[k]; return s; }
  function projects() { return get("ra.projects", []); }
  function analyses() { return (get("rateAnalysis.v1", { items: [] }).items) || []; }
  function calcRate(a) {
    var d = 0; (a.lines || []).forEach(function (l) { d += num(l.qty) * num(l.rate); });
    var oh = d * num(a.oh) / 100, pr = (d + oh) * num(a.profit) / 100;
    return (d + oh + pr) / (num(a.output) || 1);
  }
  function boqTotal(items, gst) {
    var t = 0; (items || []).forEach(function (i) { t += num(i.qty) * num(i.rate); });
    return { sub: t, gst: t * gst / 100, all: t * (1 + gst / 100) };
  }
  function nav(on) {
    var pages = [["boq", "BOQ"], ["projects", "Projects"], ["rate-analysis", "Rate Analysis"], ["reports", "Reports"], ["settings", "Settings"]];
    var el = document.getElementById("nav");
    el.innerHTML = "<b>" + esc(settings().company || "Rate Analysis") + "</b>" + pages.map(function (p) {
      return '<a href="' + p[0] + '.html"' + (p[0] === on ? ' class="on" aria-current="page"' : "") + ">" + p[1] + "</a>";
    }).join("");
  }
  function csv(name, rows) {
    var q = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
    var b = new Blob([rows.map(function (r) { return r.map(q).join(","); }).join("\n")], { type: "text/csv" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name + ".csv"; a.click(); URL.revokeObjectURL(a.href);
  }
  return { get: get, set: set, esc: esc, num: num, money: money, uid: uid, settings: settings, projects: projects, analyses: analyses, calcRate: calcRate, boqTotal: boqTotal, nav: nav, csv: csv };
})();
