---
layout: page
title: "Blog"
header:
  image_fullwidth: "header_4.jpg"
permalink: "/blog/"
breadcrumb: true
lang: fr
show_title: false
---

Bienvenue sur le blog de MorelCorp. Découvrez nos actualités, conseils et annonces importantes.

<ul>
{% for post in site.posts %}
  {% if post.lang == 'fr' or post.lang == nil %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> <small>{{ post.date | date: '%Y-%m-%d' }}</small><br>
      <em>{{ post.teaser }}</em>
    </li>
  {% endif %}
{% endfor %}
</ul>
