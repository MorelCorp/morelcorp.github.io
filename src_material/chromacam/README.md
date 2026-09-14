# ChromaCam — build and test sources

Generators and the test harness for `resources/tools/chromacam/`. Nothing here is
published: `src_material` is in the Jekyll `exclude` list.

| File | What it does |
|---|---|
| `gen_colors.py` | Writes `resources/tools/chromacam/colors.js` — the 138 unique CSS/X11 named colours plus ~70 traditional pigment colours, each with an English and a French name. Edit the tables here, never the generated file. |
| `gen_icons.py` | Writes `icon-192.png` and `icon-512.png`. Needs Pillow. |
| `make_scene.py` | Builds the synthetic "paint chips on a desk" frame used to feed Chromium's fake camera, and encodes it as y4m. The y4m is ~2.7 MB and is not committed. |
| `test_chromacam.py` | End-to-end checks in real Chromium. Needs Playwright. |

```sh
python3 src_material/chromacam/gen_colors.py resources/tools/chromacam/colors.js
python3 src_material/chromacam/gen_icons.py  resources/tools/chromacam

# 40 checks: CIEDE2000 against the Sharma reference pairs, exact and everyday
# naming, catalogue integrity, and the real picking path (load a photo of known
# patches, drag over it, compare the reading to the pixels underneath).
python3 src_material/chromacam/test_chromacam.py

# Same, plus a fresh gallery screenshot driven by the fake camera.
python3 src_material/chromacam/test_chromacam.py --shot images/microapps/chromacam.jpg
```

Remember the repo rule: any change to the app's HTML/JS/CSS also bumps `version`
in both `pages/microapps.en.md` and `pages/microapps.md`, and the `CACHE` name in
`resources/tools/chromacam/sw.js`.
