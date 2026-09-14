# -*- coding: utf-8 -*-
"""Build the synthetic 'paint chips on a desk' scene used to drive Chromium's
fake camera when capturing the gallery screenshot, and emit it as a y4m file."""
import sys, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1280, 720

CHIPS = [
    "#C8432A", "#E0762B", "#EAB43C", "#7FA23C", "#2F7D64",
    "#2B6FA8", "#3B4A8C", "#7B4B8E", "#B5547E", "#8C5A3C",
    "#D8CBB4", "#4A5259",
]

def build():
    img = Image.new("RGB", (W, H), "#B9B2A6")
    d = ImageDraw.Draw(img)
    # Soft desk gradient so the frame is not perfectly flat.
    for y in range(H):
        k = 1.0 - 0.22 * (y / H)
        d.line([(0, y), (W, y)], fill=(int(0xB9 * k), int(0xB2 * k), int(0xA6 * k)))

    cols, rows = 4, 3
    pad, gap = 90, 26
    cw = (W - 2 * pad - (cols - 1) * gap) // cols
    ch = (H - 2 * pad - (rows - 1) * gap) // rows

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    for i, hexv in enumerate(CHIPS):
        r, c = divmod(i, cols)
        x = pad + c * (cw + gap)
        y = pad + r * (ch + gap)
        sd.rounded_rectangle([x + 6, y + 10, x + cw + 6, y + ch + 10], radius=14,
                             fill=(0, 0, 0, 90))
    img = Image.alpha_composite(img.convert("RGBA"),
                                shadow.filter(ImageFilter.GaussianBlur(9))).convert("RGB")
    d = ImageDraw.Draw(img)
    for i, hexv in enumerate(CHIPS):
        r, c = divmod(i, cols)
        x = pad + c * (cw + gap)
        y = pad + r * (ch + gap)
        d.rounded_rectangle([x, y, x + cw, y + ch], radius=14, fill=hexv)
        # A paler band at the bottom, the way real paint chips are printed.
        rr, gg, bb = tuple(int(hexv[j:j + 2], 16) for j in (1, 3, 5))
        pale = tuple(int(v + (255 - v) * 0.55) for v in (rr, gg, bb))
        d.rounded_rectangle([x, y + ch - 46, x + cw, y + ch], radius=14, fill=pale)
        d.rectangle([x, y + ch - 46, x + cw, y + ch - 32], fill=pale)
    return img

def to_y4m(img, path, frames=2):
    """Write a tiny progressive 4:2:0 y4m. Chromium loops it as a camera feed."""
    px = img.load()
    w, h = img.size
    ys, us, vs = bytearray(), bytearray(), bytearray()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            ys.append(max(16, min(235, round(0.257 * r + 0.504 * g + 0.098 * b + 16))))
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r = g = b = 0
            for dy in (0, 1):
                for dx in (0, 1):
                    pr, pg, pb = px[min(x + dx, w - 1), min(y + dy, h - 1)]
                    r += pr; g += pg; b += pb
            r, g, b = r / 4, g / 4, b / 4
            us.append(max(16, min(240, round(-0.148 * r - 0.291 * g + 0.439 * b + 128))))
            vs.append(max(16, min(240, round(0.439 * r - 0.368 * g - 0.071 * b + 128))))
    with open(path, "wb") as f:
        f.write(("YUV4MPEG2 W%d H%d F25:1 Ip A1:1 C420jpeg\n" % (w, h)).encode())
        for _ in range(frames):
            f.write(b"FRAME\n")
            f.write(ys); f.write(us); f.write(vs)

if __name__ == "__main__":
    out = sys.argv[1].rstrip("/")
    im = build()
    im.save(out + "/scene.png")
    to_y4m(im, out + "/scene.y4m")
    print("wrote", out + "/scene.png", "and", out + "/scene.y4m")
