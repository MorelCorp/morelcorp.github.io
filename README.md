# MorelCorp Website

This repository contains the source code for the MorelCorp website, including the PlanPrism subsite and other resources. The site is built with Jekyll and uses custom layouts and themes.

## Project Structure

- Main site content and blog
- PlanPrism subsite: `/pages/planprism/`
- Custom layouts: `/_layouts/`
- Includes and navigation: `/_includes/`
- Assets (CSS, images): `/assets/`, `/images/`

## Prerequisites

- [Ruby](https://www.ruby-lang.org/en/documentation/installation/) (2.7 or later recommended)
- [Bundler](https://bundler.io/) (`gem install bundler`)
- [Jekyll](https://jekyllrb.com/) (`gem install jekyll`)

## Local Development

1. **Install dependencies:**

   ```sh
   bundle install
   ```

2. **Serve the site locally:**

   ```sh
   bundle exec jekyll serve
   ```

   or, if you have Jekyll installed globally:

   ```sh
   jekyll serve
   ```

3. **Open your browser to:**
   [http://localhost:4000](http://localhost:4000)

## Troubleshooting

- If you see missing gem errors, run `bundle install` again.
- If you change the Gemfile, always re-run `bundle install`.
- For issues with custom plugins, check the `_config.yml` for plugin configuration.
- If you have permission issues, try running the commands with `sudo` (Linux/macOS) or as administrator (Windows).

## Deployment

The site is deployed via GitHub Pages. All changes to the main branch are automatically published.

## Contact

For questions or support, contact: [support@morelcorp.ca](mailto:support@morelcorp.ca)
