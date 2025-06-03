---
layout: page
title: "Blog"
header:
  image_fullwidth: "header_4.jpg"
permalink: "/en/blog/"
breadcrumb: true
lang: en
show_title: false
---

<style>
.blog-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}
.blog-list-item {
  display: flex;
  align-items: flex-start;
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.blog-list-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}
.blog-list-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 1.25rem;
  background: #f0f0f0;
  flex-shrink: 0;
}
.blog-list-content {
  flex: 1 1 auto;
}
.blog-list-title {
  font-size: 1.15rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
  color: #2a4365;
  text-decoration: none;
}
.blog-list-date {
  font-size: 0.95rem;
  color: #718096;
  margin-bottom: 0.25rem;
}
.blog-list-teaser {
  font-size: 1rem;
  color: #444;
  margin-bottom: 0;
}
</style>

Welcome to the MorelCorp blog. Discover our news, tips, and important announcements.

<ul class="blog-list">
{% for post in site.posts %}
  {% if post.lang == 'en' %}
    <li class="blog-list-item">
      {% if post.cover_image %}
        <img class="blog-list-thumb" src="{{ post.cover_image.src }}" alt="{{ post.cover_image.alt }}">
      {% else %}
        <img class="blog-list-thumb" src="/assets/img/default-blog.jpg" alt="Default image">
      {% endif %}
      <div class="blog-list-content">
        <a class="blog-list-title" href="{{ post.url }}">{{ post.title }}</a>
        <div class="blog-list-date">{{ post.date | date: '%Y-%m-%d' }}</div>
        <div class="blog-list-teaser">{{ post.teaser }}</div>
      </div>
    </li>
  {% endif %}
{% endfor %}
</ul>
