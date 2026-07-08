---
title: "Blog搭建"
published: 2025-09-20
category: "学习经历"
tags: ["hexo"]
description: "迈出第一步"
draft: false
---

本网站基于 Hexo 构建，采用了 Vivia 主题，是一个风格简洁的个人博客模板。在当前版本中，“返回至顶端”、主页预览博客内容等功能尚不完善或者不符合我的使用习惯，这些都正在改进中改进。总体而言，在美观成都与易用性而言，这个模板表现非常不错。

作为该方向的初学者，我在此次网站搭建过程中基本依赖 AI 协助完成。

---

# 完成Blog基础功能的搭建

#2025年9月4日

在移除“返回至顶端”按钮后，发现主题切换按钮因继承了原按钮的点击方式，导致无法在页面顶端正常使用。为修复此 bug，需要定位相关文件，并将其中的指定代码完全删除。

以下为相关文件路径：

```
Blog\node_modules\hexo-theme-vivia\layout\_partial\back-to-top.ejs
```

以下为源文件代码（留着以防以后有用）：

```html
<div class="back-to-top-wrapper">
    <button id="back-to-top-btn" class="back-to-top-btn hide" onclick="topFunction()">
        <i class="fa-solid fa-angle-up"></i>
    </button>
</div>

<script>
    function topFunction() {
        window.scroll({ top: 0, behavior: 'smooth' });
    }
    let btn = document.getElementById('back-to-top-btn');
    function scrollFunction() {
        if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
            btn.classList.remove('hide')
        } else {
            btn.classList.add('hide')
        }
    }
    window.onscroll = function() {
        scrollFunction();
    }
</script>
```

接下来将进行下一步的开发，希望一切顺利。

---


# 主页展示方式的修改

#2025年9月8日

## 添加abstract

```bash
Blog\node_modules\hexo-theme-vivia\source\css\_partial
```

在上述文件夹中，创建 abstract.styl 文件，文件中代码如下：

```stylus
.abstract-box
  border-left 4px solid skyblue
  color #000
  padding-left 10px
  line-height 1.6
  margin 16px 0
  display block

html[theme="dark"] .abstract-box
  color #fff
```

## 修改展示方式

```bash
Blog\node_modules\hexo-theme-vivia\layout\_partial\artical.ejs
```

在上述文件中，将以下部分:

```html
<div class="e-content article-entry" itemprop="articleBody">
  <% if (post.excerpt && index){ %>
    <%- post.excerpt %>
  <% } else if (is_home() && !post.excerpt && theme.home.style != 'detail') { %>
    <div class="truncate-text">
     <% if(description){ %>
      <%- strip_html(post.description) %>
     <% } else{ %>
      <%- truncate(strip_html(post.content), {length: 500}) %>
     <% } %>
    </div>
  <% } else { %>
    <%- post.content %>
  <% } %>
</div>
```

修改为：

```html
<div class="e-content article-entry" itemprop="articleBody">
  <% if (is_home() && post.abstract) { %>
    <div class="post-abstract abstract-box">
      <%= post.abstract %>
    </div>
  <% } else if (post.excerpt && index) { %>
    <%- post.excerpt %>
  <% } else if (is_home() && !post.excerpt && theme.home.style != 'detail') { %>
    <div class="truncate-text">
     <% if(description){ %>
      <%- strip_html(post.description) %>
     <% } else{ %>
      <%- truncate(strip_html(post.content), {length: 500}) %>
     <% } %>
    </div>
  <% } else { %>
    <%- post.content %>
  <% } %>
</div>
```

在修改之后，若加入了abstract，则会直接显示abstract；否则显示原文内容。

---

# 修改About的显示方式

#2025年9月8日

```bash
Blog\node_modules\hexo-theme-vivia\layout\_partial\article.ejs
```

在以上文件路径中，找到以下代码：

```html
<div class='meta-info-bar'>    
  <%- partial('post/date', {class_name: 'meta-info', date_format: null}) %>    
  <div class="need-seperator meta-info">    
    <%- partial('post/category') %>     
  </div>    
  <div class="wordcount need-seperator meta-info">    
    <%- symbolsCount(post) %> <%- __('words') %>     
  </div>    
</div>
```

修改为：

```html
<% if (post.layout !== 'page') { %>
  <div class='meta-info-bar'>    
    <%- partial('post/date', {class_name: 'meta-info', date_format: null}) %>    
    <div class="need-seperator meta-info">    
      <%- partial('post/category') %>     
    </div>    
    <div class="wordcount need-seperator meta-info">    
      <%- symbolsCount(post) %> <%- __('words') %>     
    </div>    
  </div>
<% } %>
```

在修改之后，About界面就不再显示时间、分类与字数。

---

# 完善Blog字数的计算

#2025年9月8日

```bash
Blog\node_modules\hexo-theme-vivia\languages\zh-CN.yml
```

以上文件中把 words 中的“词”改为“字”，则主页显示的则为字而不是词。

```bash
Blog\node_modules\hexo-theme-vivia\scripts
```

在以上文件夹中添加文件wordcount.js，以下为代码：

```js
hexo.extend.helper.register('symbolsCount', function(post) {
  let content = post.content || '';

  // 1. 去掉多行代码块 <pre><code>...</code></pre>
  content = content.replace(/<pre.*?>[\s\S]*?<\/pre>/g, '');

  // 2. 去掉行内代码 <code>...</code>
  content = content.replace(/<code.*?>[\s\S]*?<\/code>/g, '');

  // 3. 去掉 HTML 标签
  content = content.replace(/<[^>]*>/g, '');

  // 4. 去掉空格、换行、制表符
  content = content.replace(/\s+/g, '');

  return content.length;
});
```

修改之后，Blog计数统计就不会计算代码。

---

PS：因为不支持ejs语法高亮，此处使用的html来添加代码高亮，实际为ejs.

---

# 添加Blog评论功能

#2025年9月18日

本功能基于giscus，简单实用。首先安装giscus app，并按照相关提示完成配置，得到配置代码。

```bash
Blog\node_modules\hexo-theme-vivia\layout\_partial
```

在以上路径中创建文件comment.ejs，加入giscus的相关配置代码。

```bash
Blog\node_modules\hexo-theme-vivia\layout\post.ejs
```

然后在以上文件中，加入以下代码:

```bash
<%- partial('_partial/comment') %>
```

配置完成。

# 添加友链版块

#2025年9月20日

很简单，在主题yaml文件中menu中添加Friends，在以下路径中：

```bash
\Blog\source\friends
```

创建index.md，以下为相关代码：

```html
---
title: Friends
---


<div class="links-content">

  <div class="card">
    <img class="ava" src="/images/example.png" />
    <div class="card-header">
      <a href="https://friend1.com">Friend One</a>
      <div class="info">个人Blog</div>
    </div>
  </div>

</div>



<style>
.links-content {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0 1rem;
}

/* 768px为moblile到tablet，1024为tablet到desktop */
@media screen and (min-width: 768px) {
  .links-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  background-color: #ffffff;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
}

.ava {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  flex-shrink: 0;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  flex-grow: 1;
}

.card-header a {
  font-weight: bold;
  font-size: 1.1rem;
  color: #007acc;
  text-decoration: none;
}

.card-header a:hover {
  color: #005fa3;
}

.info {
  color: #666;
  font-size: 0.95rem;
  margin-top: 4px;
}
</style>
```

完成。

---

# 总结

完成Blog搭建，我对于这方面不够了解，所以整个Blog都是拆东墙补西墙的，缺乏作为一个项目的整体感（尽管尽量在主题上做出统一性）。

事情告一段落，要开始摆烂了QAQ.