---
layout: page
title: "Tools"
header:
  image_fullwidth: "header_tools.jpg"
permalink: /en/resources/tools/
breadcrumb: true
lang: en
show_title: true
---

These tools are primarily used to help develop the current site. They are good examples of what's possible with AI. Previously, as a developer, it was essential to ask yourself something like: Would automating this task take me less than 10% of the total planned time and help me cut that time by a third? (you probably have your own version).

Now with generative AI, the answer is much more often yes. For any task I anticipate being somewhat repetitive, I now start by trying to create a tool for it. If after 30 minutes it doesn't work out, I move on to the task. But it works out very often.

Here are several tools that are currently useful for developing the current site.

<div class="tools-grid" style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
  {% include link-object.html
    title="Markdown Editor"
    url="/resources/tools/md-edit.html"
    description="Online Markdown editor for creating and previewing content supporting a frontmatter section for Jekyll site"
    icon="edit.svg"
  %}
  {% include link-object.html
    title="Extractor"
    url="/resources/tools/Extractor.html"
    description="Tool to extract book info and images from hardcover.app site (excellent alternative to GoodReads...)"
    icon="export.svg"
  %}
  {% include link-object.html
    title="TrackIT"
    url="/resources/tools/TrackIT.html"
    description="My (quick and dirty) version of Trello with local backup save."
    icon="calendar.svg"
  %}
  {% include link-object.html
    title="WorkDay Fitness Coach"
    url="/resources/tools/fitness-coach/fitness-coach-tracker.html"
    description="Simple browser-based fitness coach for office workers. Get exercise reminders, track your progress, and stay active during your workday."
    icon="feather.svg"
  %}
  {% include link-object.html
    title="Challenge Tracker"
    url="/resources/tools/challenge-tracker/challenge_tracker.html"
    description="Simple tracker for pushups, situps, and planks with intelligent progression and audio feedback."
    icon="feather.svg"
  %}
</div>
<style>
@media (min-width: 700px) {
  .tools-grid {
    grid-template-columns: 1fr 1fr !important;
  }
}
</style>

## Using AI?

To generate this kind of tool, I built myself a "template" that I fill out and enter into my current favorite generative AI (Hot battle between Claude and Gemini...)

{% include retro-codeblock.html content="
Tool Name: [What should the tool be called?]
Tool Description: [Brief description of what the tool does]

Input Section:
Input Type: [textarea/file-upload/text-input/dropdown/multiple-inputs]
Input Label: [Label for the input field]
Input Placeholder: [Placeholder text for input]
Additional Inputs: [Any extra inputs needed - specify type and label]

Processing Function:
What it does: [Describe the conversion/processing logic needed]
Output format: [How should the result be displayed - text/code/formatted/downloadable]

UI Preferences:
Theme: [dark/light/auto]
Primary Color: [color preference or default]
Layout: [single-column/two-column/tabbed]

Additional Features:
Copy to clipboard: [yes/no]
Download result: [yes/no - specify file extension]
Clear/Reset button: [yes/no]
Example/Sample data: [provide sample input if helpful]
Error handling: [specify any validation rules]
" %}
