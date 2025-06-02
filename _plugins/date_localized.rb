# frozen_string_literal: true
require 'time'

module Jekyll
  module DateLocalized
    MONTHS_FR = %w[janvier février mars avril mai juin juillet août septembre octobre novembre décembre]
    MONTHS_EN = %w[January February March April May June July August September October November December]

    def date_localized(input, lang = 'en')
      return '' if input.nil? || input == ''
      begin
        date = input.is_a?(String) ? Time.parse(input) : input
        if lang == 'fr'
          "#{date.day} #{MONTHS_FR[date.month - 1]} #{date.year}"
        else
          "#{MONTHS_EN[date.month - 1]} #{date.day}, #{date.year}"
        end
      rescue
        ''
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::DateLocalized) 