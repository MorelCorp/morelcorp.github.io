# -*- coding: utf-8 -*-
"""Generate ChromaCam's PNG icons: a hue ring around a white target reticle.
Content stays inside the maskable safe zone (a circle of radius 0.4 x size)."""
import colorsys, sys
from PIL import Image, ImageDraw

BG = (11, 15, 20, 255)

def render(size):
    ss = 4                      # supersample, then downscale for clean edges
    s = size * ss
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Rounded-square plate.
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=BG)

    cx = cy = s / 2
    r_out, r_in = s * 0.345, s * 0.225
    segments = 24
    for i in range(segments):
        a0 = i * 360.0 / segments - 90
        a1 = (i + 1) * 360.0 / segments - 90 + 0.6   # slight overlap, no seams
        r, g, b = colorsys.hsv_to_rgb(i / segments, 0.88, 1.0)
        d.pieslice([cx - r_out, cy - r_out, cx + r_out, cy + r_out],
                   a0, a1, fill=(int(r * 255), int(g * 255), int(b * 255), 255))
    d.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=BG)

    # Target reticle.
    lw = max(2, int(s * 0.026))
    r_ret = s * 0.135
    d.ellipse([cx - r_ret, cy - r_ret, cx + r_ret, cy + r_ret], outline=(255, 255, 255, 255), width=lw)
    tick, gap = s * 0.075, s * 0.035
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        d.line([cx + dx * (r_ret + gap), cy + dy * (r_ret + gap),
                cx + dx * (r_ret + gap + tick), cy + dy * (r_ret + gap + tick)],
               fill=(255, 255, 255, 255), width=lw)
    d.ellipse([cx - lw, cy - lw, cx + lw, cy + lw], fill=(255, 255, 255, 255))

    return img.resize((size, size), Image.LANCZOS)

if __name__ == '__main__':
    out = sys.argv[1].rstrip('/')
    for n in (192, 512):
        render(n).save('%s/icon-%d.png' % (out, n))
        print('wrote %s/icon-%d.png' % (out, n))
