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

Welcome to the MorelCorp blog. Discover our news, tips, and important announcements.

<ul>
{% for post in site.posts %}
  {% if post.lang == 'en' %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date: '%Y-%m-%d' }}</small><br>
      <em>{{ post.teaser }}</em>
    </li>
  {% endif %}
{% endfor %}
</ul>
