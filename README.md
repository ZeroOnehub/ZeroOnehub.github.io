# 个人网站

纯静态单页，部署在 GitHub Pages。无需构建。

## 更新内容
**只改 `data.js`**：个人信息、项目、文章、联系方式都在里面。
- 字符串留空 → 对应内容不显示；数组留空 → 整个板块（含导航）不显示
- 加项目：在 `projects` 里加一条，封面放 `assets/projects/`
- 搜索 / 微信分享预览：同步修改 `index.html` 顶部的 title、description、og 标签

## 板块和字段
页面从上到下是一条工作流：首屏（触发器 → Agent → 输出）→ 能力 → 项目 → 方法 → 经历 → 联系。
- `pillars`：能力，每条可加 `proof`（对应哪个作品）
- `projects`：`featured: true` 的放最前面用大卡片；`group` 用于筛选，`category` 是卡片左上角标签，`kind` 是 AI 形态；讲解四段 `problem / judgment / approach / highlights`，其他卡片点“展开讲解”就地展开
- `method`：`forms`（AI 形态怎么选）、`flow`（做事流程）、`principles`（底线）
- `about` + `experience` + `education`：经历板块，上面是自我介绍，下面是时间线

## 本地预览
```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 上线前检查
- 页面顶部的红色"尚未填写完成"提示条已消失
- 邮箱、电话、每个外链都亲自点一遍
- 全文搜索不到 `TODO` / `example` / `xxx`
