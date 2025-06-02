# frozen_string_literal: true

# Jekyll plugin to compute reading time for posts/pages, bilingual (EN/FR)
# Usage: {{ page.reading_time }} in templates

module Jekyll
  class ReadingTimeGenerator < Generator
    priority :low
    def generate(site)
      site.posts.docs.each { |post| set_reading_time(post) }
      site.pages.each { |page| set_reading_time(page) }
    end

    def set_reading_time(doc)
      return if doc.data['reading_time'] # allow manual override
      words = doc.content.split.size
      lang = doc.data['lang'] || doc.site.config['language'] || 'fr'
      wpm = (lang == 'en') ? 200 : 180
      minutes = (words / wpm.to_f).ceil
      if lang == 'en'
        doc.data['reading_time'] = minutes <= 1 ? '1 minute read' : "#{minutes} minutes read"
      else
        doc.data['reading_time'] = minutes <= 1 ? 'lecture de 1 minute' : "lecture de #{minutes} minutes"
      end
    end
  end
end 