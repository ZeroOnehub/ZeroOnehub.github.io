/* 读取 data.js 渲染页面，并驱动"工作流运行"动画。内容请改 data.js，不要改这里。 */
(() => {
  "use strict";
  const S = window.SITE || {};
  const P = S.profile || {};
  const C = S.contact || {};
  const META = S.site || {};
  const projects = S.projects || [];

  const $ = (id) => document.getElementById(id);
  const has = (v) => (Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : !!v);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ext = (url) => (/^https?:\/\//.test(url) ? ' target="_blank" rel="noopener"' : "");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const host = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const ICONS = {
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    note: '<path d="M5 3h10l4 4v14H5z"/><path d="M9 10h6M9 14h6M9 18h3"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
    term: '<path d="m4 17 6-5-6-5"/><path d="M12 19h8"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    send: '<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3.5-10.5 5.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
  };
  const icon = (n, s = 14) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

  /* ---------- 基本信息 ---------- */
  const name = P.name || P.nameEn || "";
  if (has(P.name)) document.title = P.name + " · " + (P.role || "AI 产品经理");
  $("tb-name").textContent = name || "Portfolio";

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  $("trig-time").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  /* ---------- 首屏：Agent 节点 ---------- */
  $("agent-role").textContent = P.role || "Agent";
  $("hero-name").textContent = name;
  $("hero-name-en").textContent = P.name && P.nameEn ? P.nameEn : "";
  $("hero-tagline").textContent = P.tagline || "";
  $("hero-proof").textContent = P.proof || "";
  $("avatar").innerHTML = has(P.avatar)
    ? `<img src="${esc(P.avatar)}" alt="${esc(name)} 的照片" width="152" height="152">`
    : `<div class="seal">${esc(name.trim().charAt(0) || "·")}</div>`;

  const params = [];
  if (has(P.tags)) params.push(["skills", `<div class="chips">${P.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`]);
  if (has(P.status)) params.push(["status", esc(P.status)]);
  if (has(P.location)) params.push(["location", esc(P.location)]);
  if (has(C.email)) params.push(["email", esc(C.email)]);
  $("params").innerHTML = params.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

  /* ---------- 首屏：输出节点 ---------- */
  const outs = [];
  if (has(projects)) outs.push({ href: "#projects", ico: "layers", type: "输出 · 项目", title: "查看项目", sub: `${projects.length} 个项目节点` });
  if (has(C.email) || has(C.phone)) outs.push({ href: "#contact", ico: "mail", type: "输出 · 联系", title: "联系我", sub: C.email || C.phone });
  if (has(C.github)) outs.push({ href: C.github, ico: "git", type: "输出 · 外链", title: "GitHub", sub: host(C.github) });
  $("outputs").innerHTML = outs
    .map((o, i) => `<a class="node out-node" href="${esc(o.href)}"${ext(o.href)}>
        <span class="port in" data-port="o-in-${i}"></span>
        <div class="node-head"><span class="n-ico">${icon(o.ico, 13)}</span>${esc(o.type)}</div>
        <div class="node-body"><div class="out-title">${esc(o.title)}<span class="arr">→</span></div><div class="out-sub">${esc(o.sub)}</div></div>
      </a>`)
    .join("");

  /* ---------- 下方节点 ---------- */
  const stages = [];

  if (has(S.pillars)) {
    const body = '<div class="chain">' + S.pillars.map((p, i) =>
      (i ? '<div class="chain-link" aria-hidden="true"></div>' : "") +
      `<div class="sub"><div class="sub-head"><span>step_${pad(i + 1)}</span>${has(p.verb) ? `<span class="sub-verb">${esc(p.verb)}</span>` : ""}</div>
        <h3>${esc(p.title)}</h3>${has(p.text) ? `<p>${esc(p.text)}</p>` : ""}</div>`).join("") + "</div>";
    stages.push({ id: "pillars", nav: "能力", title: "能力", type: "Chain", icon: "cpu", count: `${S.pillars.length} 个子节点`, body, log: `串联 ${S.pillars.length} 个能力子节点` });
  }

  if (has(S.about)) {
    stages.push({ id: "about", nav: "关于", title: "关于我", type: "Note", icon: "note", body: `<div class="about">${S.about.map((t) => `<p>${esc(t)}</p>`).join("")}</div>`, log: "读取个人简介" });
  }

  const projectCard = (p) => {
    const l = p.links || {};
    const main = l.github || l.demo || l.doc || "";
    const wip = /进行中/.test(p.status || "");
    const links = [];
    if (has(l.github)) links.push(`<a href="${esc(l.github)}"${ext(l.github)}>GitHub ↗</a>`);
    if (has(l.demo)) links.push(`<a href="${esc(l.demo)}"${ext(l.demo)}>Demo ↗</a>`);
    if (has(l.doc)) links.push(`<a href="${esc(l.doc)}"${ext(l.doc)}>文档 ↗</a>`);
    return `<article class="pnode" data-cat="${esc(p.category || "")}">
      <span class="port in"></span><span class="port out"></span>
      <div class="pnode-head"><span class="pcat">${esc(p.category || "Project")}</span>${has(p.status) ? `<span class="pstatus${wip ? " wip" : ""}">${esc(p.status)}</span>` : ""}</div>
      ${has(p.cover) ? `<div class="pcover"><img src="${esc(p.cover)}" alt="${esc(p.name)} 演示" loading="lazy"></div>` : ""}
      <div class="pnode-body">
        <h3>${main ? `<a href="${esc(main)}"${ext(main)}>${esc(p.name)}</a>` : esc(p.name)}</h3>
        <p>${esc(p.oneLiner || "")}</p>
        ${has(p.tags) ? `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      </div>
      ${links.length || has(p.date) ? `<div class="pnode-foot">${links.join("")}${has(p.date) ? `<span class="pdate">${esc(p.date)}</span>` : ""}</div>` : ""}
    </article>`;
  };
  if (has(projects)) {
    const cats = [...new Set(projects.map((p) => p.category).filter(has))];
    const filters = cats.length > 1
      ? `<div class="filters" id="project-filters" role="tablist" aria-label="按方向筛选">
          <button class="filter" role="tab" aria-selected="true" data-cat="">全部 ${projects.length}</button>
          ${cats.map((c) => `<button class="filter" role="tab" aria-selected="false" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}
        </div>`
      : "";
    stages.push({ id: "projects", nav: "项目", title: "项目", type: "Group", icon: "layers", count: `${projects.length} 个节点`, body: filters + `<div class="pgrid" id="project-list">${projects.map(projectCard).join("")}</div>`, log: `加载 ${projects.length} 个项目节点` });
  }

  const row = (o) => {
    const tag = has(o.link) ? "a" : "div";
    const href = has(o.link) ? ` href="${esc(o.link)}"${ext(o.link)}` : "";
    return `<li><${tag} class="row"${href}>
      <span class="row-ts">${esc(o.ts || "")}</span>
      <div><h3>${o.badge ? `<span class="row-tag">${esc(o.badge)}</span>` : ""}${esc(o.title)}</h3>${has(o.text) ? `<p>${esc(o.text)}</p>` : ""}</div>
      <span class="go" aria-hidden="true">${has(o.link) ? "↗" : ""}</span>
    </${tag}></li>`;
  };
  if (has(S.research)) {
    stages.push({ id: "research", nav: "研究", title: "正在研究", type: "Loop", icon: "flask", count: "每周更新", body: `<ol class="rows">${S.research.map((r) => row({ ts: r.date, title: r.title, text: r.note, link: r.link })).join("")}</ol>`, log: `同步 ${S.research.length} 条研究笔记` });
  }
  if (has(S.articles)) {
    stages.push({ id: "articles", nav: "文章", title: "文章", type: "Publish", icon: "book", count: `${S.articles.length} 篇`, body: `<ol class="rows">${S.articles.map((a) => row({ ts: a.date, badge: a.platform, title: a.title, link: a.link })).join("")}</ol>`, log: `抓取 ${S.articles.length} 篇文章` });
  }
  if (has(S.tools)) {
    stages.push({ id: "tools", nav: "工具", title: "工具与小作品", type: "Tool", icon: "term", count: `${S.tools.length} 个`, body: `<ol class="rows">${S.tools.map((t) => row({ ts: "$ run", title: t.name, text: t.desc, link: t.link })).join("")}</ol>`, log: `注册 ${S.tools.length} 个工具` });
  }
  if (has(S.events)) {
    const body = '<div class="egrid">' + S.events.map((e) => {
      const tag = has(e.link) ? "a" : "div";
      const href = has(e.link) ? ` href="${esc(e.link)}"${ext(e.link)}` : "";
      return `<${tag} class="event"${href}>${has(e.photo) ? `<img src="${esc(e.photo)}" alt="${esc(e.name)}" loading="lazy">` : ""}
        <div class="event-body"><span class="row-ts">${esc(e.date || "")}</span><h3>${esc(e.name)}</h3>${has(e.takeaway) ? `<p>${esc(e.takeaway)}</p>` : ""}</div></${tag}>`;
    }).join("") + "</div>";
    stages.push({ id: "events", nav: "活动", title: "活动", type: "Event", icon: "cal", count: `${S.events.length} 场`, body, log: `回放 ${S.events.length} 场活动` });
  }

  // 联系方式：最终输出
  const big = [];
  if (has(C.email)) big.push(`<div class="c-item"><span class="c-key">email</span><div class="c-row"><a class="c-val" href="mailto:${esc(C.email)}">${esc(C.email)}</a><button class="copy-btn" type="button" data-copy="${esc(C.email)}">复制</button></div></div>`);
  if (has(C.phone)) big.push(`<div class="c-item"><span class="c-key">phone</span><div class="c-row"><a class="c-val" href="tel:${esc(C.phone.replace(/[^\d+]/g, ""))}">${esc(C.phone)}</a><button class="copy-btn" type="button" data-copy="${esc(C.phone)}">复制</button></div></div>`);
  const channels = [
    ["GitHub", C.github, has(C.github) ? host(C.github) : ""],
    ["小红书", C.xiaohongshu, "主页"],
    ["公众号", C.mpLink, C.mpName || "文章"],
    ["人人都是产品经理", C.woshipm, "专栏主页"],
    ["X / Twitter", C.x, has(C.x) ? host(C.x) : ""],
  ].filter((c) => has(c[1])).map(([n, u, s]) =>
    `<a class="channel" href="${esc(u)}"${ext(u)}><div class="ch-text"><div class="ch-name">${esc(n)}</div><div class="ch-sub">${esc(s)}</div></div><span class="go" aria-hidden="true">↗</span></a>`);
  if (has(C.wechatId)) channels.push(`<button class="channel" type="button" data-copy="${esc(C.wechatId)}"><div class="ch-text"><div class="ch-name">微信</div><div class="ch-sub">${esc(C.wechatId)} · 点击复制</div></div><span class="go" aria-hidden="true">⧉</span></button>`);
  if (has(C.mpName) && !has(C.mpLink)) channels.push(`<div class="channel"><div class="ch-text"><div class="ch-name">公众号</div><div class="ch-sub">搜索「${esc(C.mpName)}」</div></div></div>`);
  if (has(C.resume)) channels.push(`<a class="channel" href="${esc(C.resume)}" download><div class="ch-text"><div class="ch-name">简历 PDF</div><div class="ch-sub">点击下载</div></div><span class="go" aria-hidden="true">↓</span></a>`);
  const qrs = [];
  if (has(C.wechatQr)) qrs.push(`<figure class="qr"><img src="${esc(C.wechatQr)}" alt="微信二维码" loading="lazy">微信</figure>`);
  if (has(C.mpQr)) qrs.push(`<figure class="qr"><img src="${esc(C.mpQr)}" alt="公众号二维码" loading="lazy">公众号</figure>`);
  if (big.length || channels.length || qrs.length) {
    stages.push({
      id: "contact", nav: "联系", title: "联系我", type: "Output", icon: "send", cls: "output", count: "最终输出",
      body: `<p class="c-intro">${esc(C.intro || "")}</p><div class="c-big">${big.join("")}</div><div class="channels">${channels.join("")}</div><div class="qr-row">${qrs.join("")}</div>`,
      log: "输出联系方式",
    });
  }

  $("flow").innerHTML =
    stages.map((st, i) => `<section class="stage" id="${st.id}">
      <div class="link" aria-hidden="true"></div>
      <div class="frame ${st.cls || ""}">
        <span class="port in"></span>
        <header class="frame-head">
          <span class="f-ico">${icon(st.icon)}</span><h2>${esc(st.title)}</h2>
          <span class="f-type">${st.type} · #${pad(i + 1)}</span>
          ${st.count ? `<span class="f-count">${esc(st.count)}</span>` : ""}
          <span class="f-status" data-status>待运行</span>
        </header>
        <div class="frame-body">${st.body}</div>
        <span class="port out"></span>
      </div>
    </section>`).join("") +
    `<div class="end" id="end"><div class="link" aria-hidden="true"></div><div class="end-pill">${icon("flag", 13)}<span id="end-text">流程结束 · 感谢浏览</span></div></div>`;

  const nodeCount = 2 + outs.length + stages.length;
  $("canvas-meta").innerHTML =
    `<span>portfolio.flow · <b>● 已部署</b> · ${nodeCount} 个节点${has(META.updated) ? ` · 更新于 ${esc(META.updated)}` : ""}</span>` +
    `<span class="hint">点右上角 ▶ 运行，看看会发生什么</span>`;

  /* ---------- 项目筛选 ---------- */
  const filterEl = $("project-filters");
  if (filterEl) {
    filterEl.addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      filterEl.querySelectorAll(".filter").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      const cat = b.dataset.cat;
      $("project-list").innerHTML = projects.filter((p) => !cat || p.category === cat).map(projectCard).join("");
    });
  }

  /* ---------- 页脚 ---------- */
  const right = [];
  if (has(C.github)) right.push(`<a href="${esc(C.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (has(META.updated)) right.push(`<span>最后更新 ${esc(META.updated)}</span>`);
  right.push('<a href="#top">回到顶部 ↑</a>');
  $("footer").innerHTML = `<span>© ${now.getFullYear()} ${esc(name)} · 用工作流的方式介绍自己</span><span class="footer-links">${right.join("")}</span>`;

  /* ---------- 导航 ---------- */
  const navEl = $("nav-links");
  navEl.innerHTML = stages.map((st) => `<a href="#${st.id}" data-for="${st.id}">${st.nav}</a>`).join("");
  const menuBtn = $("menu-btn");
  menuBtn.addEventListener("click", () => {
    const open = navEl.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navEl.addEventListener("click", (e) => {
    if (e.target.closest("a")) { navEl.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });
  const navLink = (id) => navEl.querySelector(`[data-for="${id}"]`);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navEl.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.dataset.for === en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  stages.forEach((st) => spy.observe($(st.id)));

  /* ---------- 首屏连线 ---------- */
  const graph = $("graph");
  const svg = $("wires");
  const edges = [["t-out", "a-in"], ...outs.map((_, i) => ["a-out", `o-in-${i}`])];
  let paths = [];
  const center = (key, g) => {
    const r = graph.querySelector(`[data-port="${key}"]`).getBoundingClientRect();
    return [r.left + r.width / 2 - g.left, r.top + r.height / 2 - g.top];
  };
  function drawWires() {
    const g = graph.getBoundingClientRect();
    const horizontal = matchMedia("(min-width: 980px)").matches;
    svg.setAttribute("width", g.width);
    svg.setAttribute("height", g.height);
    let html = "";
    paths = edges.map(([a, b]) => {
      const [x1, y1] = center(a, g);
      const [x2, y2] = center(b, g);
      let d;
      if (horizontal) {
        const dx = Math.max(30, Math.abs(x2 - x1) / 2);
        d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
      } else {
        const dy = Math.max(20, Math.abs(y2 - y1) / 2);
        d = `M${x1} ${y1} C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`;
      }
      html += `<path class="w-base" d="${d}"/><path class="w-flow" d="${d}"/>`;
      return d;
    });
    svg.innerHTML = html;
  }
  drawWires();
  new ResizeObserver(drawWires).observe(graph);
  if (document.fonts) document.fonts.ready.then(drawWires);

  // 数据包沿连线流动
  function packet(i, dur = 650) {
    if (reduce) return Promise.resolve();
    return new Promise((res) => {
      const ns = "http://www.w3.org/2000/svg";
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", paths[i]);
      const len = path.getTotalLength();
      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("r", 5);
      dot.setAttribute("class", "packet");
      svg.appendChild(dot);
      const t0 = performance.now();
      let finished = false;
      const finish = () => { if (finished) return; finished = true; dot.remove(); res(); };
      // 后台标签页里 rAF 会暂停，用定时器兜底，保证流程一定能走完
      setTimeout(finish, dur + 200);
      const step = (t) => {
        if (finished) return;
        const k = Math.min(1, (t - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const pt = path.getPointAtLength(len * e);
        dot.setAttribute("cx", pt.x);
        dot.setAttribute("cy", pt.y);
        if (k < 1) requestAnimationFrame(step);
        else finish();
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- 运行逻辑 ---------- */
  const trigger = $("n-trigger");
  const agent = $("n-agent");
  const bar = $("agent-bar");
  const agentStatus = $("agent-status");
  const outNodes = [...$("outputs").children];
  const checkMark = icon("check", 12);

  async function runHero(fast) {
    trigger.classList.remove("fired");
    agent.classList.remove("done", "running");
    outNodes.forEach((n) => n.classList.remove("ready"));
    svg.classList.remove("live");
    bar.style.transition = "none";
    bar.style.width = "0";
    agentStatus.innerHTML = "等待触发";
    if (reduce) {
      trigger.classList.add("fired"); agent.classList.add("done"); bar.style.width = "100%";
      agentStatus.innerHTML = `${checkMark} 成功`; outNodes.forEach((n) => n.classList.add("ready")); svg.classList.add("live");
      return;
    }
    await sleep(fast ? 120 : 400);
    trigger.classList.add("fired");
    await packet(0, fast ? 450 : 650);
    agent.classList.add("running");
    agentStatus.innerHTML = '<i class="spin"></i>生成主页中';
    const ms = fast ? 600 : 1000;
    void bar.offsetWidth;
    bar.style.transition = `width ${ms}ms cubic-bezier(.4,0,.2,1)`;
    bar.style.width = "100%";
    await sleep(ms);
    agent.classList.remove("running");
    agent.classList.add("done");
    agentStatus.innerHTML = `${checkMark} 成功 · ${((fast ? 1050 : 1650) / 1000).toFixed(2)}s`;
    await Promise.all(outNodes.map((n, i) => packet(i + 1, fast ? 450 : 600).then(() => n.classList.add("ready"))));
    svg.classList.add("live");
  }

  const frames = stages.map((st) => $(st.id));
  const durOf = (i) => 280 + ((i * 137) % 260);
  async function runStage(i, fast) {
    const sec = frames[i];
    const fr = sec.querySelector(".frame");
    const st = fr.querySelector("[data-status]");
    const ms = reduce ? 0 : fast ? Math.round(durOf(i) * 0.7) : durOf(i);
    sec.classList.add("live");
    fr.classList.remove("done");
    fr.classList.add("running");
    st.innerHTML = '<i class="spin"></i>运行中';
    await sleep(ms);
    fr.classList.remove("running");
    fr.classList.add("done");
    st.innerHTML = `${checkMark} ${(Math.max(ms, 120) / 1000).toFixed(2)}s`;
    const nl = navLink(stages[i].id);
    if (nl) nl.classList.add("done");
    if (i === frames.length - 1) $("end").classList.add("live");
    return ms;
  }

  // 滚动到哪个节点，哪个节点就运行
  let runningAll = false;
  const ran = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting || runningAll) return;
      const i = frames.indexOf(en.target);
      if (i < 0 || ran.has(i)) return;
      ran.add(i);
      io.unobserve(en.target);
      runStage(i, false);
    });
  }, { rootMargin: "0px 0px -18% 0px", threshold: 0.15 });
  frames.forEach((f) => io.observe(f));

  runHero(false);

  /* ---------- ▶ 运行：整条工作流从头跑一遍 ---------- */
  const runBtn = $("run-btn");
  const log = $("log");
  const logList = $("log-list");
  const logLine = (t, text, ok) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="t">+${(t / 1000).toFixed(2)}s</span><span>${esc(text)}</span><span class="ok">${ok ? "✓" : ""}</span>`;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight;
  };
  $("log-close").addEventListener("click", () => { log.hidden = true; });

  runBtn.addEventListener("click", async () => {
    if (runningAll) return;
    runningAll = true;
    runBtn.classList.add("busy");
    log.hidden = false;
    log.classList.add("busy");
    logList.innerHTML = "";
    const t0 = performance.now();
    const el = () => performance.now() - t0;

    frames.forEach((f) => {
      f.classList.remove("live");
      const fr = f.querySelector(".frame");
      fr.classList.remove("done", "running");
      fr.querySelector("[data-status]").textContent = "待运行";
    });
    navEl.querySelectorAll("a").forEach((a) => a.classList.remove("done"));
    $("end").classList.remove("live");

    logLine(el(), "触发器 · page_view", true);
    await runHero(true);
    logLine(el(), `Agent · 加载 ${name || "个人"} 的资料`, true);
    if (outs.length) logLine(el(), `分发到 ${outs.length} 个输出节点`, true);
    for (let i = 0; i < frames.length; i++) {
      await runStage(i, true);
      ran.add(i);
      logLine(el(), `${stages[i].title} · ${stages[i].log}`, true);
    }
    const li = document.createElement("li");
    li.className = "final";
    li.textContent = `✓ 工作流完成：${nodeCount} 个节点，耗时 ${(el() / 1000).toFixed(2)}s`;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight;
    log.classList.remove("busy");
    runBtn.classList.remove("busy");
    runningAll = false;
    toast(has(C.email) ? "运行完成 —— 欢迎联系我" : "运行完成");
  });

  /* ---------- 深浅色 ---------- */
  $("theme-btn").addEventListener("click", () => {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- 复制 ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const text = b.getAttribute("data-copy");
    const done = () => toast("已复制：" + text);
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (err) { toast("复制失败，请手动复制"); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });

  /* ---------- 未填写提醒（全部填好后自动消失） ---------- */
  const missing = [];
  if (!has(P.name)) missing.push("profile.name 姓名");
  if (!has(P.tagline)) missing.push("profile.tagline 一句话人设");
  if (!has(C.email)) missing.push("contact.email 邮箱");
  if (!has(C.github)) missing.push("contact.github");
  if (!has(META.url)) missing.push("site.url 网站地址");
  if (!document.querySelector('meta[name="description"]').content) missing.push("index.html 里的 description / og 标签");
  if (missing.length) {
    const bn = $("setup-banner");
    bn.hidden = false;
    bn.textContent = "⚠ 网站尚未填写完成，请在 data.js 补充：" + missing.join("、");
  }
})();
