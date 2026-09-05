---
layout: page-fullwidth
title: "Microapps"
subheadline: "De petits outils, un vrai impact"
header:
  image_fullwidth: "header_tools.jpg"
permalink: /microapps/
breadcrumb: true
lang: fr
show_title: true
---

<p class="teaser">Des applications autonomes qui fonctionnent directement dans le navigateur — sans installation, sans compte, sans friction. La plupart ont été créées avec l'IA en moins d'une heure. Chacune fait une chose, et la fait bien.</p>

<style>
.microapps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin: 2rem 0;
}
@media (min-width: 600px) {
  .microapps-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 960px) {
  .microapps-grid { grid-template-columns: 1fr 1fr 1fr; }
}

.microapp-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
}
.microapp-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  transform: translateY(-2px);
}
.microapp-screenshot-link {
  display: block;
  text-decoration: none;
}
.microapp-screenshot-wrapper {
  position: relative;
  overflow: hidden;
  background: #f0f4f8;
  aspect-ratio: 16/9;
}
.microapp-screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  transition: transform 0.3s;
}
.microapp-card:hover .microapp-screenshot {
  transform: scale(1.03);
}
.microapp-overlay {
  position: absolute;
  inset: 0;
  background: rgba(37,99,235,0.0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}
.microapp-card:hover .microapp-overlay {
  opacity: 1;
  background: rgba(37,99,235,0.55);
}
.microapp-launch-btn {
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.03em;
  background: rgba(255,255,255,0.18);
  border: 2px solid #fff;
  border-radius: 8px;
  padding: 0.5em 1.2em;
}
.microapp-info {
  padding: 1rem 1.1rem 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.microapp-category {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 4px;
  padding: 2px 8px;
  margin-bottom: 0.45rem;
  background: #e8f0fe;
  color: #2563eb;
}
.microapp-category--wellness { background: #dcfce7; color: #15803d; }
.microapp-category--learning { background: #fef9c3; color: #92400e; }
.microapp-category--data { background: #fce7f3; color: #9d174d; }
.microapp-category--facilitation { background: #ede9fe; color: #6d28d9; }
.microapp-category--productivity { background: #e0f2fe; color: #0369a1; }

.microapp-title {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  line-height: 1.3;
}
.microapp-title a {
  color: #1a202c;
  text-decoration: none;
  font-weight: 700;
}
.microapp-title a:hover { color: #2563eb; }
.microapp-description {
  margin: 0;
  font-size: 0.88rem;
  color: #4a5568;
  line-height: 1.5;
}

.microapp-type-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 4px;
  padding: 2px 7px;
  background: rgba(124,58,237,0.85);
  color: #fff;
  z-index: 1;
}
.microapp-type-badge--script { background: rgba(217,119,6,0.85); }
.microapp-type-badge--executable { background: rgba(5,150,105,0.85); }

.microapp-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.6rem;
  border-top: 1px solid #e2e8f0;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.microapp-feature-badges {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.microapp-feature-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.67rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
  white-space: nowrap;
}
.microapp-feature-badge--upgrade {
  background: #f0fdf4;
  color: #15803d;
}
.microapp-version {
  font-size: 0.67rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
  margin-left: auto;
}

.microapp-philosophy {
  background: #f8fafc;
  border-left: 4px solid #2563eb;
  border-radius: 0 8px 8px 0;
  padding: 1.2rem 1.5rem;
  margin: 2.5rem 0 0;
}
.microapp-philosophy h2 {
  margin-top: 0;
  font-size: 1.1rem;
}
</style>

<div class="microapps-grid">

  {% include microapp_card.html
    title="1-2-4-All Session Manager"
    url="/resources/tools/124all-session-manager.html"
    screenshot="/images/microapps/124all.jpg"
    category="Facilitation"
    description="Animez un atelier 1-2-4-All : importez les participants, formez des groupes aléatoires et gérez le temps avec un compte à rebours intégré."
    type="PWA"
    local_memory="true"
    upgradeable="false"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="WorkDay Fitness Coach"
    url="/resources/tools/fitness-coach/fitness-coach-tracker.html"
    screenshot="/images/microapps/fitness-coach.jpg"
    category="Wellness"
    description="Coach fitness pour les travailleurs de bureau. Rappels d'exercices, suivi de la progression, et rester actif pendant la journée de travail."
    type="PWA"
    local_memory="true"
    upgradeable="true"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="Gym In A Box"
    url="/resources/tools/gym-in-a-box/gym-in-a-box.html"
    screenshot="/images/microapps/gym-in-a-box.jpg"
    category="Wellness"
    description="Application d'entraînement à domicile en style RPG pixel art. Quêtes générées, rangs XP, minuteries de repos et calendrier. Entièrement hors ligne."
    type="PWA"
    local_memory="true"
    upgradeable="true"
    version="1.7.0"
  %}

  {% include microapp_card.html
    title="Challenge Tracker"
    url="/resources/tools/challenge-tracker/challenge_tracker.html"
    screenshot="/images/microapps/challenge-tracker.jpg"
    category="Wellness"
    description="Suivez vos pompes, abdominaux et planches avec une progression intelligente et des retours audio."
    type="PWA"
    local_memory="true"
    upgradeable="true"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="NihonSupermemo"
    url="/resources/tools/NihonSupermemo/NihonSupermemo.html"
    screenshot="/images/microapps/nihon-supermemo.jpg"
    category="Apprentissage"
    description="Application d'apprentissage du japonais (kana et kanji) avec répétition espacée et plusieurs modes d'étude."
    type="PWA"
    local_memory="true"
    upgradeable="true"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="SuperMemo2 Concept Trainer"
    url="/resources/tools/supermemo2-trainer/"
    screenshot="/images/microapps/supermemo2.jpg"
    category="Apprentissage"
    description="Apprenez des acronymes et des concepts avec importation CSV, planification SuperMemo2, et support hors ligne complet."
    type="PWA"
    local_memory="true"
    upgradeable="true"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="Éditeur Markdown"
    url="/resources/tools/md-edit.html"
    screenshot="/images/microapps/markdown-editor.jpg"
    category="Productivité"
    description="Éditeur Markdown en ligne avec aperçu en direct et support du frontmatter Jekyll — utile pour rédiger du contenu de site."
    type="PWA"
    local_memory="false"
    upgradeable="false"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="TrackIT"
    url="/resources/tools/TrackIT.html"
    screenshot="/images/microapps/trackit.jpg"
    category="Productivité"
    description="Un tableau kanban léger inspiré de Trello avec sauvegarde locale — faites avancer les choses sans créer de compte."
    type="PWA"
    local_memory="true"
    upgradeable="false"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="Convertisseur PDF vers TXT"
    url="/resources/tools/pdf-to-txt-converter.html"
    screenshot="/images/microapps/pdf-converter.jpg"
    category="Données"
    description="Convertissez des PDF en texte directement dans le navigateur avec une interface glisser-déposer et suivi de la progression."
    type="PWA"
    local_memory="false"
    upgradeable="false"
    version="1.0.0"
  %}

  {% include microapp_card.html
    title="Extractor"
    url="/resources/tools/Extractor.html"
    screenshot="/images/microapps/extractor.jpg"
    category="Données"
    description="Extrayez les informations de livres et les couvertures depuis Hardcover.app — une excellente alternative à Goodreads."
    type="PWA"
    local_memory="false"
    upgradeable="false"
    version="1.0.0"
  %}

</div>

<div class="microapp-philosophy">
  <h2>La philosophie derrière ces outils</h2>
  <p>La vieille question était : <em>automatiser cette tâche me prendra-t-il moins de temps que la faire manuellement ?</em> Avec l'IA générative, la réponse est presque toujours oui maintenant. Pour toute tâche répétitive, j'essaie d'abord de construire un outil. Si ça ne marche pas en 30 minutes, je passe à autre chose. Ça marche la plupart du temps — et le résultat est cette collection d'outils ciblés qui sont vraiment utilisés.</p>
</div>
