/* 读取 data.js 渲染页面。内容请改 data.js，不要改这里。 */
(function () {
  "use strict";
  var S = window.SITE || {};
  var P = S.profile || {};
  var C = S.contact || {};
  var META = S.site || {};

  var $ = function (id) { return document.getElementById(id); };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : !!v; };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  // 外链新窗口打开；站内路径 / mailto / tel 原地打开
  var ext = function (url) { return /^https?:\/\//.test(url) ? ' target="_blank" rel="noopener"' : ""; };
  var show = function (id, cond) { $(id).hidden = !cond; return cond; };

  /* ---------- 元信息 ---------- */
  if (has(P.name)) document.title = P.name + " · " + (P.role || "AI 产品经理");

  /* ---------- 刊头 ---------- */
  var brandText = P.name || P.nameEn || "Portfolio";
  $("mast-brand").innerHTML = '<span class="dot"></span>' + esc(brandText);

  var now = new Date();
  var issue = (META.updated || now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0")).slice(0, 7).replace("-", " · ");
  var issueParts = ["No. " + issue, (P.nameEn || P.name || "") + " Portfolio", P.location ? P.location : "", META.updated ? "更新于 " + META.updated : ""];
  $("issue-line").innerHTML = issueParts.filter(has).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");

  /* ---------- 封面 ---------- */
  $("hero-role").textContent = P.role || "";
  $("hero-name").textContent = P.name || P.nameEn || "";
  $("hero-name-en").textContent = P.name && P.nameEn ? P.nameEn : "";
  $("hero-tagline").textContent = P.tagline || "";
  $("hero-tagline").hidden = !has(P.tagline);
  $("hero-proof").textContent = P.proof || "";
  $("hero-proof").hidden = !has(P.proof);
  $("hero-tags").innerHTML = (P.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

  if (has(P.avatar)) {
    $("portrait").innerHTML = '<img src="' + esc(P.avatar) + '" alt="' + esc(P.name) + ' 的照片" width="640" height="800">';
  } else {
    var initial = (P.name || P.nameEn || "").trim().charAt(0);
    $("portrait").innerHTML = '<div class="seal' + (initial ? "" : " seal-only") + '"><span>' + esc(initial || "印") + "</span></div>";
  }

  var facts = [];
  if (has(P.status)) facts.push(["状态", P.status]);
  if (has(P.location)) facts.push(["城市", P.location]);
  if (has(C.email)) facts.push(["邮箱", C.email]);
  $("hero-facts").innerHTML = facts.map(function (f) {
    return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>";
  }).join("");

  var projects = S.projects || [];
  var actions = [];
  if (has(projects)) actions.push('<a class="btn solid" href="#projects">看我的项目 <span class="arr">→</span></a>');
  actions.push('<a class="btn" href="#contact">联系我</a>');
  if (has(C.resume)) actions.push('<a class="btn" href="' + esc(C.resume) + '" download>下载简历</a>');
  $("hero-actions").innerHTML = actions.join("");

  /* ---------- 三支柱 ---------- */
  if (show("pillars", has(S.pillars))) {
    $("pillars-list").innerHTML = S.pillars.map(function (p, i) {
      return '<div class="pillar"><span class="pillar-no">0' + (i + 1) + "</span>" +
        "<h3>" + esc(p.title) + "</h3>" +
        (has(p.verb) ? '<div class="verb">' + esc(p.verb) + "</div>" : "") +
        (has(p.text) ? "<p>" + esc(p.text) + "</p>" : "") + "</div>";
    }).join("");
  }

  /* ---------- 关于我 ---------- */
  if (show("about", has(S.about))) {
    $("about-body").innerHTML = S.about.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
  }

  /* ---------- 项目 ---------- */
  function projectCard(p, i) {
    var l = p.links || {};
    var main = l.github || l.demo || l.doc || "";
    var wip = /进行中/.test(p.status || "");
    var title = main ? '<a href="' + esc(main) + '"' + ext(main) + ">" + esc(p.name) + "</a>" : esc(p.name);
    var btns = [];
    if (has(l.github)) btns.push('<a href="' + esc(l.github) + '"' + ext(l.github) + ">GitHub ↗</a>");
    if (has(l.demo)) btns.push('<a href="' + esc(l.demo) + '"' + ext(l.demo) + ">在线 Demo ↗</a>");
    if (has(l.doc)) btns.push('<a href="' + esc(l.doc) + '"' + ext(l.doc) + ">产品文档 ↗</a>");
    return '<article class="card reveal" data-cat="' + esc(p.category || "") + '">' +
      '<div class="card-top"><span class="card-no">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<div class="card-meta">' +
        (has(p.category) ? '<div class="cat">' + esc(p.category) + "</div>" : "") +
        (has(p.status) || has(p.date) ? '<div class="status' + (wip ? " wip" : "") + '">' + esc([p.status, p.date].filter(has).join(" · ")) + "</div>" : "") +
      "</div></div>" +
      (has(p.cover) ? '<div class="card-cover"><img src="' + esc(p.cover) + '" alt="' + esc(p.name) + ' 演示" loading="lazy"></div>' : "") +
      "<h3>" + title + "</h3>" +
      (has(p.oneLiner) ? "<p>" + esc(p.oneLiner) + "</p>" : "<p></p>") +
      (has(p.tags) ? '<ul class="tags">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
      (btns.length ? '<div class="card-links">' + btns.join("") + "</div>" : "") +
      "</article>";
  }
  function renderProjects(cat) {
    var list = projects.map(function (p, i) { return [p, i]; }).filter(function (x) { return !cat || x[0].category === cat; });
    $("project-list").innerHTML = list.map(function (x) { return projectCard(x[0], x[1]); }).join("");
    observe($("project-list").querySelectorAll(".reveal"));
  }
  if (show("projects", has(projects))) {
    var cats = [];
    projects.forEach(function (p) { if (has(p.category) && cats.indexOf(p.category) < 0) cats.push(p.category); });
    if (cats.length > 1) {
      var f = $("project-filters");
      f.innerHTML = ['<button class="filter" role="tab" aria-selected="true" data-cat="">全部 ' + projects.length + "</button>"]
        .concat(cats.map(function (c) { return '<button class="filter" role="tab" aria-selected="false" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }))
        .join("");
      f.addEventListener("click", function (e) {
        var b = e.target.closest(".filter");
        if (!b) return;
        f.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        renderProjects(b.getAttribute("data-cat"));
      });
    }
  }

  /* ---------- 正在研究 ---------- */
  if (show("research", has(S.research))) {
    $("research-list").innerHTML = S.research.map(function (r) {
      var t = has(r.link) ? '<a href="' + esc(r.link) + '"' + ext(r.link) + ">" + esc(r.title) + " ↗</a>" : esc(r.title);
      return '<li class="reveal">' + (has(r.date) ? '<span class="now-date">' + esc(r.date) + "</span>" : "") +
        "<h3>" + t + "</h3>" + (has(r.note) ? "<p>" + esc(r.note) + "</p>" : "") + "</li>";
    }).join("");
  }

  /* ---------- 文章 ---------- */
  if (show("articles", has(S.articles))) {
    $("article-list").innerHTML = S.articles.map(function (a) {
      var tag = has(a.link) ? "a" : "div";
      var href = has(a.link) ? ' href="' + esc(a.link) + '"' + ext(a.link) : "";
      return "<" + tag + ' class="article reveal' + (has(a.cover) ? " has-cover" : "") + '"' + href + ">" +
        (has(a.cover) ? '<img class="article-cover" src="' + esc(a.cover) + '" alt="" loading="lazy">' : "") +
        "<div><h3>" + esc(a.title) + "</h3>" +
        '<div class="article-meta">' + (has(a.platform) ? '<span class="plat">' + esc(a.platform) + "</span>" : "") + esc(a.date || "") + "</div></div>" +
        (has(a.link) ? '<span class="go" aria-hidden="true">↗</span>' : "<span></span>") +
        "</" + tag + ">";
    }).join("");
  }

  /* ---------- 工具 ---------- */
  if (show("tools", has(S.tools))) {
    $("tool-list").innerHTML = S.tools.map(function (t) {
      var tag = has(t.link) ? "a" : "div";
      var href = has(t.link) ? ' href="' + esc(t.link) + '"' + ext(t.link) : "";
      return "<" + tag + ' class="tool reveal"' + href + "><h3>" + esc(t.name) + (has(t.link) ? " ↗" : "") + "</h3>" +
        (has(t.desc) ? "<p>" + esc(t.desc) + "</p>" : "") + "</" + tag + ">";
    }).join("");
  }

  /* ---------- 活动 ---------- */
  if (show("events", has(S.events))) {
    $("event-list").innerHTML = S.events.map(function (e) {
      var tag = has(e.link) ? "a" : "div";
      var href = has(e.link) ? ' href="' + esc(e.link) + '"' + ext(e.link) : "";
      return "<" + tag + ' class="event reveal"' + href + ">" +
        (has(e.photo) ? '<img src="' + esc(e.photo) + '" alt="' + esc(e.name) + '" loading="lazy">' : "") +
        (has(e.date) ? '<span class="now-date">' + esc(e.date) + "</span>" : "") +
        "<h3>" + esc(e.name) + "</h3>" + (has(e.takeaway) ? "<p>" + esc(e.takeaway) + "</p>" : "") +
        "</" + tag + ">";
    }).join("");
  }

  /* ---------- 联系 ---------- */
  var primary = [];
  if (has(C.email)) {
    primary.push('<div class="big-contact"><span class="lbl">邮箱 EMAIL</span><div class="big-row">' +
      '<a class="val" href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" +
      '<button class="copy-btn" type="button" data-copy="' + esc(C.email) + '">复制邮箱</button></div></div>');
  }
  if (has(C.phone)) {
    var tel = C.phone.replace(/[^\d+]/g, "");
    primary.push('<div class="big-contact"><span class="lbl">电话 PHONE</span><div class="big-row">' +
      '<a class="val" href="tel:' + esc(tel) + '">' + esc(C.phone) + "</a>" +
      '<button class="copy-btn" type="button" data-copy="' + esc(C.phone) + '">复制号码</button></div></div>');
  }
  $("contact-primary").innerHTML = primary.join("");

  var host = function (u) { return u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); };
  var channels = [
    ["GitHub", C.github, has(C.github) ? host(C.github) : ""],
    ["小红书", C.xiaohongshu, "主页"],
    ["公众号", C.mpLink, C.mpName || "文章"],
    ["人人都是产品经理", C.woshipm, "专栏主页"],
    ["X / Twitter", C.x, has(C.x) ? host(C.x) : ""],
  ].filter(function (c) { return has(c[1]); });
  var chHtml = channels.map(function (c) {
    return '<a class="channel" href="' + esc(c[1]) + '"' + ext(c[1]) + '><div class="ch-text"><div class="ch-name">' + esc(c[0]) +
      '</div><div class="ch-sub">' + esc(c[2]) + '</div></div><span class="go" aria-hidden="true">↗</span></a>';
  });
  if (has(C.wechatId)) {
    chHtml.push('<button class="channel copy-like" type="button" data-copy="' + esc(C.wechatId) + '">' +
      '<div class="ch-text"><div class="ch-name">微信</div><div class="ch-sub">' + esc(C.wechatId) + ' · 点击复制</div></div><span class="go" aria-hidden="true">⧉</span></button>');
  }
  if (has(C.mpName) && !has(C.mpLink)) {
    chHtml.push('<div class="channel"><div class="ch-text"><div class="ch-name">公众号</div><div class="ch-sub">搜索「' + esc(C.mpName) + '」</div></div></div>');
  }
  $("channel-list").innerHTML = chHtml.join("");

  var qrs = [];
  if (has(C.wechatQr)) qrs.push('<figure class="qr"><img src="' + esc(C.wechatQr) + '" alt="微信二维码" loading="lazy">微信</figure>');
  if (has(C.mpQr)) qrs.push('<figure class="qr"><img src="' + esc(C.mpQr) + '" alt="公众号二维码" loading="lazy">公众号' + (has(C.mpName) ? "「" + esc(C.mpName) + "」" : "") + "</figure>");
  $("qr-list").innerHTML = qrs.join("");
  $("contact-intro").textContent = C.intro || "";
  show("contact", primary.length || chHtml.length || qrs.length);

  /* ---------- 页脚 ---------- */
  var foot = ["<span>© " + now.getFullYear() + " " + esc(P.name || P.nameEn || "") + "</span>"];
  var right = [];
  if (has(C.github)) right.push('<a href="' + esc(C.github) + '" target="_blank" rel="noopener">GitHub</a>');
  if (has(META.updated)) right.push("<span>最后更新 " + esc(META.updated) + "</span>");
  right.push('<a href="#top">回到顶部 ↑</a>');
  foot.push("<span class=\"footer-links\">" + right.join("") + "</span>");
  $("footer").innerHTML = foot.join("");

  /* ---------- 导航（只列出有内容的板块） ---------- */
  var navItems = [["about", "关于"], ["projects", "项目"], ["research", "研究"], ["articles", "文章"], ["tools", "工具"], ["events", "活动"], ["contact", "联系"]]
    .filter(function (n) { return !$(n[0]).hidden; });
  var navEl = $("nav-links");
  navEl.innerHTML = navItems.map(function (n) { return '<a href="#' + n[0] + '">' + n[1] + "</a>"; }).join("");
  var menuBtn = $("menu-btn");
  menuBtn.addEventListener("click", function () {
    var open = navEl.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navEl.addEventListener("click", function (e) {
    if (e.target.closest("a")) { navEl.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  if ("IntersectionObserver" in window) {
    var links = {};
    navEl.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navItems.forEach(function (n) { spy.observe($(n[0])); });
  }

  /* ---------- 深浅色切换 ---------- */
  $("theme-btn").addEventListener("click", function () {
    var root = document.documentElement;
    var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- 复制 ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var text = b.getAttribute("data-copy");
    var done = function () { toast("已复制：" + text); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (err) { toast("复制失败，请手动复制"); }
      ta.remove();
    }
  });

  /* ---------- 滚动淡入 ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function observe(nodes) {
    nodes.forEach(function (n) { if (io) io.observe(n); else n.classList.add("in"); });
  }
  if (has(projects)) renderProjects("");
  observe(document.querySelectorAll(".reveal"));

  /* ---------- 未填写提醒（全部填好后自动消失，上线前务必让它消失） ---------- */
  var missing = [];
  if (!has(P.name)) missing.push("profile.name 姓名");
  if (!has(P.tagline)) missing.push("profile.tagline 一句话人设");
  if (!has(C.email)) missing.push("contact.email 邮箱");
  if (!has(C.github)) missing.push("contact.github");
  if (!has(META.url)) missing.push("site.url 网站地址");
  if (!document.querySelector('meta[name="description"]').content) missing.push("index.html 里的 description / og 标签");
  if (missing.length) {
    var bn = $("setup-banner");
    bn.hidden = false;
    bn.innerHTML = "⚠ 网站尚未填写完成，请在 data.js 补充：" + missing.map(esc).join("、");
    console.warn("[portfolio] 待填写：", missing);
  }
})();
