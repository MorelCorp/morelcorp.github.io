# MorelCorp Site — Process Notes

## Microapp versioning

Each microapp on the microapps page (`pages/microapps.en.md` and `pages/microapps.md`) carries a `version` parameter using [semver](https://semver.org/) (e.g. `1.2.0`).

**Rule: whenever you update a microapp's HTML/JS/CSS, also bump its `version` in both microapps pages.**

- Bug fix → patch version (1.0.0 → 1.0.1)
- New feature → minor version (1.0.0 → 1.1.0)
- Breaking change or full rewrite → major version (1.0.0 → 2.0.0)

Each app entry looks like:

```liquid
{% raw %}
{% include microapp_card.html
  title="App Name"
  ...
  version="1.0.0"
%}
{% endraw %}
```

Update the `version` field in **both** `pages/microapps.en.md` and `pages/microapps.md`.

## Microapp card metadata fields

| Field | Values | Meaning |
|---|---|---|
| `type` | `PWA`, `Script`, `Executable` | App delivery type |
| `local_memory` | `"true"` / `"false"` | Saves data in browser localStorage/IndexedDB |
| `upgradeable` | `"true"` / `"false"` | Has service worker that auto-updates the app |
| `version` | semver string | App version (update on every change) |

## Site structure

- `pages/microapps.en.md` — English microapps gallery
- `pages/microapps.md` — French microapps gallery
- `_includes/microapp_card.html` — Card template (HTML only, CSS lives in the page files)
- `_data/navigation_en.yml` — English nav
- `_data/navigation.yml` — French nav
- `pages/team.en.md` / `pages/team.md` — About / team page
