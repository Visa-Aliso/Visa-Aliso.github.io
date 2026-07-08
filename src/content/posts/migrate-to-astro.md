---
title: "从 Hexo 迁移到 Astro"
published: 2026-07-08
category: "学习经历"
tags: ["hexo", "astro", "fuwari"]
description: "把旧 Hexo 博客快照保留下来，并把日常写作迁移到基于 Astro 的 Fuwari"
draft: false
---

# 为什么迁移

最开始搭建这个博客的时候，我还是一个刚接触前端的新手。那时候对于静态博客框架并没有太多了解，最后看教程直接选择了 Hexo 作为博客框架，使用的是 Vivia 主题，也陆续根据自己的需求对博客做了不少修改。

前段时间，我偶然发现 Vivia 已经推出了基于 Astro 的版本，而且项目一直保持着持续维护。然后发现自己以前花了不少时间手动实现的很多功能，在新版本中都已经得到了原生支持，整体的设计和开发体验也更加现代化。不仅如此，Astro 本身在性能、构建速度以及内容管理方面也比当初的 Hexo 更有优势。

于是现在我把博客从 Hexo 迁移到 Astro。一方面可以摆脱过去自己改的主题的各种丑陋的代码，另一方面也能借着这次迁移重新整理博客的结构和配置，让后续的维护更加轻松。

# 保留旧站

迁移不是为了丢弃过去。旧的 Hexo 站点被整树保留下来，作为可点开浏览的「时间胶囊」快照，搬进新站的 public/legacy/ 目录，随构建产物一起发布到 /legacy/ 路径下。

这样既不丢历史内容，也让新站保持干净——旧站是只读快照，新内容只写在 Astro 这边。

# 改路径让旧站自洽

旧站所有链接都是根路径，举例如下：

```bash
/css/style.css
/archives
/tags/Linux/
/2025/09/02/无限进步/
```

放进 /legacy/ 子路径后，这些链接会全部指到新站根，样式断、跳转断。

写了一个脚本 scripts/prepare-legacy.js，递归遍历旧站所有 HTML，把根路径属性重写成 /legacy/ 开头，举例如下：

```bash
# 改动前
src="/js/script.js"
href="/archives"

# 改动后
src="/legacy/js/script.js"
href="/legacy/archives"
```

跳过 //cdn 和完整 URL，顺便给每个 body 标签加上 data-pagefind-ignore。跑一次后旧站就能在新站子路径里完整自洽浏览，导航、翻页、样式都不坏。

# 排除出新站索引

旧站快照不应该污染新站的搜索结果和 SEO：

- **Pagefind**：靠脚本注入的 body[data-pagefind-ignore]，搜索索引自动跳过旧站整页。
- **Sitemap**：在 astro.config.mjs 给 sitemap() 加了一行 filter，把含 /legacy/ 的 URL 排除出 sitemap。具体写法如下：

```js
filter: (page) => !page.includes("/legacy/")
```

这样搜索框只反映新内容，搜索引擎也只收录新站页面。

# 验证与小结

构建后访问博文里的链接跳到 /legacy/，旧站的首页、归档、分类、标签、文章内页都能正常导航，样式不崩、不跳回新站根。新旧两套互不干扰，迁移完成。

如果你想看看这次迁移前是什么样子，可以点这里访问[旧版博客](/legacy/)，整个 Hexo 站点被原样保留下来作为快照。