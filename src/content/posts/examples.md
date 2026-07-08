---
title: Examples
published: 2024-01-01
description: "Fuwari 所有功能示例合集：Markdown、扩展语法、代码块、视频等。"
tags: [Markdown, Demo, Fuwari, Example]
category: Examples
draft: false
---

> 本篇合并了 Fuwari 模板的所有示例文章，涵盖 Markdown 基础语法、扩展功能、Expressive Code 代码块、嵌入视频以及使用指南。

---

# Markdown 基础语法

## 标题与段落

Paragraphs are separated by a blank line.

2nd paragraph. _Italic_, **bold**, and `monospace`. Itemized lists
look like:

- this one
- that one
- the other one

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺

### 有序列表

1. first item
2. second item
3. third item

### 代码块

```python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print(i)
```

### 表格

| size | material  | color        |
| ---- | --------- | ------------ |
| 9    | leather   | brown        |
| 10   | hemp      | canvas natural |
| 11   | glass     | transparent  |

### 数学公式

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi = 3.1415926535 \; 8979323846 \; 2643383279 \; 5028841971 \; 6939937510 \; 5820974944
\end{equation*}
$$

### 脚注

Here's a footnote [^1].

[^1]: Footnote text goes here.

---

# Markdown 扩展功能

## GitHub 仓库卡片

::github{repo="Fabrizz/MMM-OnSpotify"}

```markdown
::github{repo="saicaca/fuwari"}
```

## Admonitions 提示框

:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::

:::important
Crucial information necessary for users to succeed.
:::

:::warning
Critical content demanding immediate user attention due to potential risks.
:::

:::caution
Negative potential consequences of an action.
:::

### 自定义标题

:::note[自定义标题]
This is a note with a custom title.
:::

### GitHub 语法

> [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.

### Spoiler 剧透

The content :spoiler[is hidden **ayyy**]!

---

# Expressive Code 代码块

## 语法高亮

```js
console.log('This code is syntax highlighted!')
```

## 编辑器与终端框架

### 代码编辑器框架

```js title="my-test-file.js"
console.log('Title attribute example')
```

### 终端框架

```bash
echo "This terminal frame has no title"
```

### 覆盖框架类型

```sh frame="none"
echo "Look ma, no frame!"
```

## 文本与行标记

### 标记整行

```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

### 选择标记类型

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('this line is marked as deleted')
  // This line and the next one are marked as inserted
  console.log('this is the second inserted line')

  return 'this line uses the neutral default marker type'
}
```

### Diff 语法

```diff
+this line will be marked as inserted
-this line will be marked as deleted
this is a regular line
```

```diff lang="js"
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```

## 可折叠区域

```js collapse={1-5, 12-14, 21-24}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1
  const b = 2
  const c = a + b

  // This will remain visible
  console.log(`Calculation result: ${a} + ${b} = ${c}`)
  return c
}

// All this code until the end of the block will be collapsed again
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: 'End of example boilerplate code' })
```

## 行号

```js showLineNumbers
// This code block will show line numbers
console.log('Greetings from line 2!')
console.log('I am on line 3')
```

```js showLineNumbers startLineNumber=5
console.log('Greetings from line 5!')
console.log('I am on line 6')
```

## 自动换行

```js wrap
// Example with wrap
function getLongString() {
  return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'
}
```

---

# 嵌入视频

Just copy the embed code from YouTube or other platforms, and paste it in the markdown file.

## YouTube

<iframe width="100%" height="468" src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Bilibili

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

---

# Fuwari 使用指南

## 文章 Front-matter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | The title of the post.                                                                                                                                                                                      |
| `published`   | The date the post was published.                                                                                                                                                                            |
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `draft`       | If this post is still a draft, which won't be displayed.                                                                                                                                                    |

## 文件放置位置

Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

---

# 博客使用指南

## 创建新文章

在 `src/content/posts/` 目录下新建 `.md` 文件，文件头部使用以下 front-matter：

```yaml
---
title: 我的第一篇文章
published: 2025-09-20
description: 这是文章的简短描述，会显示在首页列表中。
image: ./cover.jpg   # 可选，文章封面图
tags: [学习, 教程]    # 可选，标签
category: 学习经历     # 可选，分类
draft: false         # 是否草稿（草稿不会显示）
---
```

| 字段 | 说明 |
| --- | --- |
| `title` | 文章标题 |
| `published` | 发布日期 |
| `description` | 简短描述，显示在首页 |
| `image` | 封面图路径。1. `http://` 开头：网络图片 2. `/` 开头：`public` 目录 3. 无前缀：相对于 md 文件 |
| `tags` | 标签数组 |
| `category` | 分类名称 |
| `draft` | 是否为草稿 |

## 如何添加 Projects 项目

打开 `src/pages/projects.astro`，在顶部的 `projects` 数组中添加你的项目即可。

### 添加一个有 GitHub 链接的项目

```ts
{
    name: "🏠 我的博客",
    description: "基于 Astro + Fuwari 搭建的个人博客。",
    date: "2025-09",
    primaryUrl: "https://github.com/Visa-Aliso/Asipe",
    links: [
        { icon: "fa6-brands:github", url: "https://github.com/Visa-Aliso/Asipe" },
    ],
}
```

### 添加一个有多个链接的项目

```ts
{
    name: "🤖 刷课机",
    description: "自动选课脚本。",
    date: "2025-08",
    primaryUrl: "https://github.com/Visa-Aliso/AutoElective",
    links: [
        { icon: "fa6-brands:github", url: "https://github.com/Visa-Aliso/AutoElective" },
        { icon: "material-symbols:description-outline-rounded", url: "https://docs.example.com" },
        { icon: "fa6-solid:flask", url: "https://demo.example.com" },
    ],
}
```

### 添加一个占位项目

还没有内容时用占位卡片填充：

```ts
{ name: "📐 Coming Soon", description: "Work in progress, stay tuned.", date: "", links: [], placeholder: true }
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 项目名称，建议以 emoji 开头 |
| `description` | 是 | 一行描述 |
| `date` | 是 | 格式 `YYYY-MM`，越新的越靠前；占位项目留空 |
| `primaryUrl` | 否 | 点击项目名称跳转的链接 |
| `links` | 是 | 底部图标按钮数组；占位项目为空 `[]` |
| `placeholder` | 否 | 设为 `true` 表示占位卡片（虚线边框 + 半透明） |

### 排序与折叠规则

- 项目按 `date` 从新到旧自动排序，占位项目排最后
- 每个分区超过 4 个项目时自动折叠，点击「展开更多」展开
- 分区只有 `Projects` 和 `Learning` 两个，不要随意增减

### 可用图标

图标来自 [Iconify](https://icones.js.org)，常用图标集：

| 图标集 | 前缀 | 示例 |
| --- | --- | --- |
| Material Symbols | `material-symbols:` | `material-symbols:description-outline-rounded` |
| FA6 Brands | `fa6-brands:` | `fa6-brands:github` |
| FA6 Solid | `fa6-solid:` | `fa6-solid:flask` |

前往 [icones.js.org](https://icones.js.org) 搜索图标，复制名称填入 `icon` 字段即可。

## 添加友链

编辑 `src/pages/links.astro` 文件顶部的 `friends` 数组：

```ts
const friends = [
    {
        name: "KiloxGo",
        description: "Homepage",
        avatar: "https://github.com/KiloxGo.png",  // 头像 URL
        url: "https://profile.kilox.top",           // 站点链接
    },
    // 添加更多友链...
];
```

## 可用图标

本站使用 [Iconify](https://icones.js.org) 图标库，支持以下图标集：

| 图标集 | 前缀 | 示例 |
| --- | --- | --- |
| Material Symbols | `material-symbols:` | `material-symbols:home-outline-rounded` |
| Font Awesome 6 Brands | `fa6-brands:` | `fa6-brands:github` |
| Font Awesome 6 Regular | `fa6-regular:` | `fa6-regular:address-card` |
| Font Awesome 6 Solid | `fa6-solid:` | `fa6-solid:star` |

前往 [icones.js.org](https://icones.js.org) 搜索图标，复制图标名称即可使用。

### 在 Projects 中使用图标

```ts
links: [
    { icon: "fa6-brands:github", url: "https://github.com/..." },
    { icon: "material-symbols:article-outline-rounded", url: "https://docs.example.com" },
    { icon: "fa6-solid:flask", url: "https://demo.example.com" },
]
```

### 在 Profile 侧栏使用图标

编辑 `src/config.ts` 中的 `profileConfig.links`：

```ts
links: [
    { name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/Visa-Aliso" },
    { name: "Bilibili", icon: "fa6-brands:bilibili", url: "https://space.bilibili.com/..." },
    { name: "Email", icon: "material-symbols:mail-outline-rounded", url: "mailto:xxx@example.com" },
]
```

## 修改主题色

### 在线调色

点击导航栏右侧的调色板图标 🎨，拖动滑块即可实时切换整站色相（0-360）。颜色会保存在浏览器的 `localStorage` 中。

### 修改默认色相

编辑 `src/config.ts`：

```ts
export const siteConfig: SiteConfig = {
    themeColor: {
        hue: 250,  // 0-360，250 = 青色，0 = 红色，300 = 紫色，345 = 粉色
        fixed: false,  // 设为 true 则隐藏调色器，锁定颜色
    },
};
```

## 修改站点信息

编辑 `src/config.ts`：

```ts
export const siteConfig: SiteConfig = {
    title: "Aliso' Blog",           // 站点标题
    subtitle: "技术宅拯救世界",       // 副标题
    lang: "zh_CN",                  // 语言
    banner: {
        enable: true,               // 是否显示横幅
        src: "/images/seele.jpg",   // 横幅图片
    },
};
```

## 评论系统配置

评论使用 Giscus（基于 GitHub Discussions）。编辑 `src/components/misc/Giscus.astro` 顶部的默认参数，或前往 [giscus.app](https://giscus.app) 获取你的配置：

```ts
const {
    repo = "Visa-Aliso/Visa-Aliso.github.io",
    repoId = "R_kgDOPp3XLg",
    category = "Announcements",
    categoryId = "DIC_kwDOPp3XLs4Cvl5a",
} = Astro.props;
```

评论会自动出现在每篇博客文章底部和友链页面，主题跟随 fuwari 的亮色/暗色模式切换。

