/**
 * ★ 网站的全部内容都在这个文件里 ★
 * 以后更新网站只改这里：加项目、加文章、改联系方式。
 *
 * 规则：
 * - 字符串留空 ""  → 对应的文字 / 按钮不显示
 * - 数组留空 []    → 整个板块不显示（导航里也会自动隐藏）
 * - 联系方式只填本人亲自核对过的真实信息，上线前逐个点一遍
 */
window.SITE = {
  /* ---------- 基本信息 ---------- */
  profile: {
    name: "樊烨",        // 中文名，如 "张三"
    nameEn: "",          // 英文名 / 拼音，如 "San Zhang"
    role: "AI 产品经理",  // 职位（显示在名字上方、标签页标题里）
    tagline: "善用 AI 提效，搭建工作流",  // 一句话人设，与 GitHub Bio 同口径，如 "5 年会计 → AI 产品经理，专注 AI + 财务"
    proof: "",           // 一行背书，如 "XX 大学 · 5 年 XX 行业经验 · 某某证书"
    tags: ["AI 产品经理", "AI 提效", "工作流搭建"],  // 2～3 个标签，如 ["AI 产品经理", "AI + 财务", "Personal Agent"]
    avatar: "",          // 头像路径，如 "assets/avatar.jpg"（留空则显示姓名首字）
    location: "",        // 可选，如 "北京"
    status: "",          // 可选，求职状态，如 "正在寻找 AI 产品经理岗位"
  },

  /* ---------- 网站元信息（搜索引擎 / 微信分享预览） ---------- */
  site: {
    url: "https://zeroonehub.github.io",  // 网站地址
    description: "樊烨 · AI 产品经理 · 善用 AI 提效，搭建工作流",  // 搜索结果描述：姓名 + AI 产品经理 + 人设关键词
    ogImage: "assets/og-cover.png",
    updated: "2026-10-19",  // 最后更新日期，如 "2026-10-19"
  },

  /* ---------- 能力三支柱（可选，空数组则不显示） ----------
   * 示例：{ title: "技术理解", verb: "问题定义", text: "一句话说明" }
   */
  pillars: [
    { title: "AI 提效", verb: "找到瓶颈", text: "识别工作里重复、耗时的环节，判断哪些适合交给 AI，哪些仍需要人来判断。" },
    { title: "工作流搭建", verb: "串起流程", text: "把模型、工具和人的判断编排成可复用的工作流，而不是一次性的对话。" },
    { title: "产品落地", verb: "验证价值", text: "用可衡量的效率提升判断一个 AI 方案值不值得做，再决定下一步投入。" },
  ],

  /* ---------- 关于我：3～5 句话，每句/每段一个字符串 ----------
   * 过往行业经历 → 为什么转 AI → 现在研究什么 → 我相信什么
   */
  about: [
    "我是樊烨，一名 AI 产品经理，关注一件具体的事：怎么让 AI 真正帮人省下时间。",
    "比起追逐最新的模型，我更在意把模型、工具和人的判断串成一条能反复使用的工作流——从发现重复劳动，到设计流程，再到验证效率是否真的提升。",
    "这里记录我正在做的 AI 产品项目和思考，欢迎交流。",
  ],

  /* ---------- 项目卡片 ----------
   * 顺序：4 个保底项目 → 出奇项目 → 组内项目 → 老项目
   * 项目没做完也要放，status 写 "进行中"
   * {
   *   name: "XX Agent",
   *   oneLiner: "一句话说明它帮谁解决什么问题",
   *   category: "Personal Agent",   // Personal Agent / AI Work / AI Video / AI Game / 出奇 / 组内 / 其他
   *   tags: ["DeepSeek", "MCP"],
   *   cover: "assets/projects/xx-agent.gif",
   *   links: { github: "", demo: "", doc: "" },
   *   status: "已上线",              // 已上线 / 进行中
   *   date: "2026-10",
   * }
   */
  projects: [
    { name: "个人 AI Agent", oneLiner: "基于开源项目二次开发的个人智能体，正在选型与搭建。", category: "Personal Agent", tags: ["Agent", "DeepSeek"], cover: "", links: { github: "", demo: "", doc: "" }, status: "进行中", date: "2026-10" },
    { name: "AI 办公工作台", oneLiner: "把日常办公中的重复环节串成 AI 工作流，正在选型与搭建。", category: "AI Work", tags: ["Workflow", "提效"], cover: "", links: { github: "", demo: "", doc: "" }, status: "进行中", date: "2026-10" },
    { name: "AI 视频创作", oneLiner: "用 AI 完成脚本、画面到成片的短视频生成流程，正在选型与搭建。", category: "AI Video", tags: ["AIGC", "视频生成"], cover: "", links: { github: "", demo: "", doc: "" }, status: "进行中", date: "2026-10" },
    { name: "AI 游戏", oneLiner: "由大模型驱动剧情与交互的小游戏，正在选型与搭建。", category: "AI Game", tags: ["LLM", "互动叙事"], cover: "", links: { github: "", demo: "", doc: "" }, status: "进行中", date: "2026-10" },
  ],

  /* ---------- 正在研究（每周更新，最近两周的 3 件新东西） ----------
   * { title: "研究了什么", note: "一句话心得", link: "", date: "2026-10" }
   */
  research: [],

  /* ---------- 文章 ----------
   * { title: "", platform: "公众号", date: "2026-10-20", link: "", cover: "" }
   */
  articles: [],

  /* ---------- 工具 / 小作品（Prompt、Skill、脚本等） ----------
   * { name: "", desc: "", link: "" }
   */
  tools: [],

  /* ---------- 活动（黑客松、分享会） ----------
   * { name: "", date: "", photo: "assets/events/xx.jpg", takeaway: "一句收获", link: "" }
   */
  events: [],

  /* ---------- 联系方式：放到最大，必须正确 ---------- */
  contact: {
    intro: "欢迎聊 AI 产品、工作流搭建，或者岗位机会。",           // 可选，联系板块的一句话，如 "欢迎聊 AI 产品、合作或内推机会"
    email: "j567564345@gmail.com",  // 必填
    phone: "156 7114 2528",  // 是否公开由你决定；不公开就留空
    wechatId: "",        // 可选
    wechatQr: "",        // 可选，如 "assets/wechat-qr.png"
    mpName: "",          // 公众号名称
    mpQr: "",            // 公众号二维码，如 "assets/mp-qr.png"
    mpLink: "",          // 公众号文章 / 主页链接
    github: "https://github.com/ZeroOnehub",
    xiaohongshu: "",     // 小红书主页链接
    woshipm: "",         // 人人都是产品经理主页链接
    x: "",               // 推特（X）主页链接，可选
    resume: "",          // 简历 PDF，如 "assets/resume.pdf"（下周写好再加）
  },
};
