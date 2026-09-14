# -*- coding: utf-8 -*-
"""End-to-end checks for ChromaCam, driven through real Chromium.

Usage:  python3 src_material/chromacam/test_chromacam.py [--shot OUT.jpg]

Covers the colour maths and naming tables, then exercises the app for real:
loads a photo with known colour patches, drags a pointer across it and checks
that the reading matches the pixels underneath. With --shot it also captures a
gallery screenshot using Chromium's fake camera fed by scene.y4m.
"""
import functools, http.server, os, socketserver, sys, threading, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

from PIL import Image                     # noqa: E402
from playwright.sync_api import sync_playwright   # noqa: E402

APP = '/resources/tools/chromacam/chromacam.html'

# Colour -> the everyday name it must produce, in both languages. These are the
# cases where naive hue-only naming gets it wrong (browns, beiges, pinks, greys).
VERNACULAR_CASES = [
    ('#8B4513', 'Dark brown',   'Marron foncé'),
    ('#D2B48C', 'Beige',        'Beige'),
    ('#808000', 'Dark olive',   'Olive foncé'),
    ('#FFC0CB', 'Pink',         'Rose'),
    ('#000000', 'Black',        'Noir'),
    ('#FFFFFF', 'White',        'Blanc'),
    ('#808080', 'Gray',         'Gris'),
    ('#FF0000', 'Vivid red',    'Rouge vif'),
    ('#FFFF00', 'Vivid yellow', 'Jaune vif'),
    ('#0000FF', 'Vivid blue',   'Bleu vif'),
    ('#2F4F4F', 'Dark gray',    'Gris foncé'),
    ('#FA8072', 'Pink',         'Rose'),
    ('#FF00FF', 'Vivid magenta', 'Magenta vif'),
    ('#800080', 'Dark purple',  'Pourpre foncé'),
    ('#D2B48C', 'Beige',        'Beige'),
    ('#00008B', 'Very dark blue', 'Bleu très foncé'),
    ('#ADD8E6', 'Pale blue',    'Bleu pâle'),
    ('#E6E6FA', 'Lavender',     'Lavande'),
]

# Colour -> the catalogued name it must land on exactly (deltaE 0).
EXACT_CASES = [
    ('#FF0000', 'Red', 'Rouge'),
    ('#008080', 'Teal', 'Sarcelle'),
    ('#003153', 'Prussian Blue', 'Bleu de Prusse'),
    ('#E34234', 'Vermilion', 'Vermillon'),
    ('#6D071A', 'Bordeaux', 'Bordeaux'),
]

# Patches painted into the test photo: (label, hex).
PATCHES = [('red', '#C8432A'), ('green', '#2F7D64'), ('blue', '#2B6FA8'), ('cream', '#D8CBB4')]


def serve(root):
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    httpd.allow_reuse_address = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, 'http://127.0.0.1:%d' % httpd.server_address[1]


def make_patch_photo(path):
    """Four equal horizontal bands of known colour, 800x800 so the 'contain' fit
    leaves letterboxing on the sides — which the pointer clamping must handle."""
    img = Image.new('RGB', (800, 800))
    px = img.load()
    for i, (_, hexv) in enumerate(PATCHES):
        rgb = tuple(int(hexv[j:j + 2], 16) for j in (1, 3, 5))
        for y in range(i * 200, (i + 1) * 200):
            for x in range(800):
                px[x, y] = rgb
    img.save(path)


def main():
    shot = None
    if '--shot' in sys.argv:
        shot = sys.argv[sys.argv.index('--shot') + 1]

    scene = os.path.join(HERE, 'scene.y4m')
    if shot and not os.path.exists(scene):
        # 2.7 MB of raw frames is not worth committing; rebuild it on demand.
        import make_scene
        make_scene.to_y4m(make_scene.build(), scene)
        print('built', scene)

    httpd, base = serve(ROOT)
    tmp = tempfile.mkdtemp()
    photo = os.path.join(tmp, 'patches.png')
    make_patch_photo(photo)

    failures, checks = [], 0

    def check(ok, label, got=None, want=None):
        nonlocal checks
        checks += 1
        if not ok:
            failures.append('%s  got=%r want=%r' % (label, got, want))

    with sync_playwright() as p:
        args = ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
        if os.path.exists(scene):
            args.append('--use-file-for-fake-video-capture=' + scene)
        browser = p.chromium.launch(executable_path=CHROME, args=args)
        ctx = browser.new_context(viewport={'width': 412, 'height': 900},
                                  device_scale_factor=2,
                                  permissions=['camera'])
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append('console.' + m.type + ': ' + m.text)
                if m.type == 'error' else None)
        page.goto(base + APP)
        page.wait_for_function('window.ChromaCam !== undefined')

        # --- catalogue sanity -------------------------------------------------
        cat = page.evaluate('window.ChromaCam.catalog.length')
        check(cat == 210, 'catalogue size', cat, 210)
        dupes = page.evaluate("""() => {
            const seen = {}, out = [];
            window.ChromaCam.catalog.forEach(c => {
                if (seen[c.hex]) out.push(c.hex); seen[c.hex] = 1;
                if (!c.en || !c.fr) out.push(c.hex + ' missing name');
            });
            return out;
        }""")
        check(dupes == [], 'catalogue has no duplicate hex / missing names', dupes, [])

        # --- exact naming -----------------------------------------------------
        for hexv, en, fr in EXACT_CASES:
            got = page.evaluate("""(h) => {
                const c = window.ChromaCam.parseHex(h);
                const n = window.ChromaCam.nearestNames(window.ChromaCam.rgbToLab(c[0],c[1],c[2]))[0];
                return [n.c.en, n.c.fr, +n.d.toFixed(2)];
            }""", hexv)
            check(got[0] == en and got[1] == fr and got[2] < 0.01,
                  'exact name ' + hexv, got, [en, fr, 0.0])

        # --- everyday naming --------------------------------------------------
        for hexv, en, fr in VERNACULAR_CASES:
            got = page.evaluate("""(h) => {
                const c = window.ChromaCam.parseHex(h);
                const v = window.ChromaCam.vernacular(c[0],c[1],c[2]);
                return [v.en, v.fr];
            }""", hexv)
            check(got[0] == en and got[1] == fr, 'everyday name ' + hexv, got, [en, fr])

        # Every catalogued colour must produce a non-empty name in both languages.
        bad = page.evaluate("""() => {
            const out = [];
            window.ChromaCam.catalog.forEach(c => {
                const p = window.ChromaCam.parseHex(c.hex);
                const v = window.ChromaCam.vernacular(p[0],p[1],p[2]);
                if (!v.en || !v.fr || /undefined|null/.test(v.en + v.fr)) out.push([c.hex, v.en, v.fr]);
            });
            return out;
        }""")
        check(bad == [], 'every catalogue colour names cleanly', bad, [])

        # --- CIEDE2000 against published reference pairs -----------------------
        # Sharma et al. test data, expressed as Lab triples.
        ref = [((50, 2.6772, -79.7751), (50, 0, -82.7485), 2.0425),
               ((50, 3.1571, -77.2803), (50, 0, -82.7485), 2.8615),
               ((50, 2.8361, -74.0200), (50, 0, -82.7485), 3.4412),
               ((50, -1.3802, -84.2814), (50, 0, -82.7485), 1.0000),
               ((60.2574, -34.0099, 36.2677), (60.4626, -34.1751, 39.4387), 1.2644),
               ((22.7233, 20.0904, -46.6940), (23.0331, 14.9730, -42.5619), 2.0373)]
        for a, b, want in ref:
            got = page.evaluate('([a,b]) => +window.ChromaCam.ciede2000(a[0],a[1],a[2],b[0],b[1],b[2]).toFixed(4)',
                                [list(a), list(b)])
            check(abs(got - want) < 0.001, 'CIEDE2000 %s vs %s' % (a, b), got, want)

        # --- the real picking path --------------------------------------------
        page.set_input_files('#fileinput', photo)
        page.wait_for_function("document.getElementById('btnPhoto').classList.contains('active')")
        page.wait_for_timeout(200)

        box = page.locator('#stagewrap').bounding_box()
        # The photo is square and fitted with 'contain', so it occupies a centred
        # square; band i is centred at that square's (i + 0.5)/4 height.
        side = min(box['width'], box['height'])
        top = box['y'] + (box['height'] - side) / 2
        cx = box['x'] + box['width'] / 2
        for i, (label, hexv) in enumerate(PATCHES):
            y = top + side * (i + 0.5) / 4
            page.mouse.move(cx, y)
            page.mouse.down()
            page.mouse.move(cx, y)
            page.mouse.up()
            got = page.locator('#cHEX').inner_text()
            check(got.upper() == hexv.upper(), 'sampled band ' + label, got, hexv)

        # Reticle must stay inside the picture even when the finger goes off it.
        page.mouse.move(box['x'] + 2, box['y'] + box['height'] / 2)
        page.mouse.down()
        page.mouse.move(box['x'] + 2, box['y'] + box['height'] / 2)
        page.mouse.up()
        got = page.locator('#cHEX').inner_text()
        check(got.upper() != '#000000', 'pointer clamped to the picture, not the letterbox',
              got, 'not black')

        # --- saving and language ----------------------------------------------
        page.click('#btnSave')
        n = page.evaluate("JSON.parse(localStorage.getItem('chromacam.history')||'[]').length")
        check(n == 1, 'saved colour is persisted', n, 1)

        page.click('#langtoggle button[data-lang="fr"]')
        check('Zone analysée' in page.inner_text('#sizerow'), 'French interface applies',
              page.inner_text('#sizerow'), 'Zone analysée')
        page.click('#langtoggle button[data-lang="en"]')

        check(errors == [], 'no page errors', errors, [])

        # --- gallery screenshot -----------------------------------------------
        if shot:
            # Match the other gallery screenshots: a 1280x800 desktop capture.
            ctx2 = browser.new_context(viewport={'width': 1280, 'height': 800},
                                       permissions=['camera'])
            page2 = ctx2.new_page()
            page2.goto(base + APP)
            page2.wait_for_function('window.ChromaCam !== undefined')
            page2.wait_for_timeout(2500)          # let the fake camera deliver frames
            b2 = page2.locator('#stagewrap').bounding_box()
            x = b2['x'] + b2['width'] * 0.33
            y = b2['y'] + b2['height'] * 0.56
            page2.mouse.move(x, y)
            page2.mouse.down()
            page2.mouse.move(x, y)
            page2.wait_for_timeout(700)
            page2.screenshot(path=shot + '.png')
            page2.mouse.up()
            Image.open(shot + '.png').convert('RGB').save(shot, quality=88)
            os.remove(shot + '.png')
            print('screenshot ->', shot)

        browser.close()
    httpd.shutdown()

    print('\n%d checks, %d failed' % (checks, len(failures)))
    for f in failures:
        print('  FAIL  ' + f)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
