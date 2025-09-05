---
layout: page
title: "Outils"
header:
  image_fullwidth: "header_tools.jpg"
permalink: /resources/tools/
breadcrumb: true
lang: fr
show_title: true
---

Ces outils sont principalement utilisés pour aider au développement du site actuel. Ils sont de bons exemples de ce qui est possible avec l'IA. Précédemment, en tant que développeur, il était primordial de se poser une question du genre: Est-ce qu'automatiser cette tâche me prendrait moins de 10% du temps total prévu et m'aiderait à couper ce temps du tiers? (vous avez probablement votre propre version).
Maintenant avec les IA génératives, la réponse est beaucoup plus souvent oui. Pour toutes tâches que je prévois un peu répétitive, je commence maintenant par tenter de me créer un outil pour. Si après 30 minutes ça n'aboutit pas, je passe à la tâche. Mais ça aboutit très souvent.

Voici plusieurs outils qui me sont présentement utiles pour le développement du site actuel.

<div class="tools-grid" style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
  {% include link-object.html
    title="Markdown Editor"
    url="/resources/tools/md-edit.html"
    description="Éditeur Markdown en ligne pour créer et prévisualiser du contenu supportant une section frontmatter pour site Jekyll"
    icon="edit.svg"
  %}
  {% include link-object.html
    title="Extractor"
    url="/resources/tools/Extractor.html"
    description="Outil pour extraire les infos et images de livre du site hardcover.app (excellente alternative à GoodReads...)"
    icon="export.svg"
  %}
  {% include link-object.html
    title="TrackIT"
    url="/resources/tools/TrackIT.html"
    description="Ma version (quick and dirty) de Trello avec sauvegarde locale en backup."
    icon="calendar.svg"
  %}
  {% include link-object.html
    title="Coach Fitness de Bureau"
    url="/resources/tools/fitness-coach/fitness-coach-tracker.html"
    description="Coach fitness simple dans le navigateur pour travailleurs de bureau. Recevez des rappels d’exercices, suivez vos progrès et restez actif."
    icon="feather.svg"
  %}
  {% include link-object.html
    title="Challenge Tracker"
    url="/resources/tools/challenge-tracker/challenge_tracker.html"
    description="Suivi simple pour pompes, abdos et planches avec progression intelligente et retour audio."
    icon="feather.svg"
  %}
  {% include link-object.html
    title="NihonSupermemo"
    url="/resources/tools/NihonSupermemo/NihonSupermemo.html"
    description="Application interactive d'apprentissage du japonais pour les kana et kanji avec répétition espacée et modes d'étude multiples."
    icon="feather.svg"
  %}
  {% include link-object.html
    title="Convertisseur PDF vers TXT"
    url="/resources/tools/pdf-to-txt-converter.html"
    description="Convertit les fichiers PDF en format texte brut avec interface glisser-déposer et suivi des progrès."
    icon="export.svg"
  %}
</div>
<style>
@media (min-width: 700px) {
  .tools-grid {
    grid-template-columns: 1fr 1fr !important;
  }
}
</style>

## Utiliser l'IA?

Pour générer ce genre d'outil, je me suis bâtit un "template" que je remplis et entre dans mon IA générative préférée du moment (Chaude lutte entre Claude et Gemini...)

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
