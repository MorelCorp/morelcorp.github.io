---
layout: principles
permalink: /principles/
title: "Principles"
teaser: "Personal management and leadership principles — hard-won beliefs about teams, process, and decision-making."
---

# Principles

These are my working beliefs about managing people, building teams, and running software projects. They're not universal laws — they're the things I've come to rely on through experience, argument, and occasionally being wrong.

I update them as I learn.

{% assign sorted_principles = site.principles | sort: "title" %}
{% for principle in sorted_principles %}
<div class="principles-card">
  <h2><a href="{{ principle.url }}">{{ principle.title }}</a></h2>
  <p class="principles-teaser">{{ principle.teaser }}</p>
  <a href="{{ principle.url }}" class="button is-warning is-light is-small">Read &rarr;</a>
</div>
{% endfor %}
