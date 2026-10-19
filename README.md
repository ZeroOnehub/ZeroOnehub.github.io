# 个人网站

纯静态单页，部署在 GitHub Pages。无需构建。

## 更新内容
**只改 `data.js`**：个人信息、项目、文章、联系方式都在里面。
- 字符串留空 → 对应内容不显示；数组留空 → 整个板块（含导航）不显示
- 加项目：在 `projects` 里加一条，封面放 `assets/projects/`
- 搜索 / 微信分享预览：同步修改 `index.html` 顶部的 title、description、og 标签

## 本地预览
```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 上线前检查
- 页面顶部的红色"尚未填写完成"提示条已消失
- 邮箱、电话、每个外链都亲自点一遍
- 全文搜索不到 `TODO` / `example` / `xxx`
