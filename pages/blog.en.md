---
layout: page
title: "Blog"
header:
  image_fullwidth: "header_unsplash_9.jpg"
permalink: "/en/blog/"
lang: en
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
