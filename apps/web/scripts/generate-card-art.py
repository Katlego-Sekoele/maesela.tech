"""
Generate the grungy, blue-duotone, dithered card/section images from public-domain
classical artworks (downloaded separately into SRC).

Pipeline per image: grayscale -> autocontrast -> square center-crop -> resize ->
Floyd-Steinberg dither (1-bit) -> map to a blue duotone (deep-blue ink + pale stipple),
echoing the image treatment on hermes-agent.nousresearch.com.

Source artworks (all public domain):
  experience     - Joseph Wright, "The Alchemist..."            (The Alchemist)
  projects       - Pieter Bruegel the Elder, "The Tower of Babel"
  education      - Antonello da Messina, "St Jerome in his Study"
  certifications - Peter Paul Rubens, "Helena Fourment in a Fur Robe" (Madonna in a Fur Coat)
  talks          - James McNeill Whistler, "Nocturne in Blue and Green" (White Nights)
"""
import os
import numpy as np
from PIL import Image, ImageOps, ImageEnhance

SRC = os.environ.get(
    "CARD_ART_SRC",
    "/private/tmp/claude-501/-Users-maesela-Repositories-maesela-tech/67f9ceaf-72fa-4817-b864-f3eb0cb2db29/scratchpad/src",
)
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "cards"))
os.makedirs(OUT, exist_ok=True)

N = 820  # output resolution (kept modest so the dither grain stays coarse/rough)

# Duotone — a bold blue field with pale stipple, theme-independent like Hermes.
BG = np.array([26, 26, 232], dtype=np.float64)   # deep blue "ink"
FG = np.array([232, 235, 255], dtype=np.float64)  # pale, near-white

SECTIONS = ["experience", "projects", "education", "certifications", "talks"]

# per-image tuning: (brightness, contrast, vertical crop bias 0=top..1=bottom)
TUNE = {
    "experience": (1.05, 1.15, 0.45),
    "projects": (1.08, 1.20, 0.40),
    "education": (1.10, 1.10, 0.50),
    "certifications": (1.12, 1.05, 0.35),
    "talks": (1.15, 1.25, 0.50),
}


def find_src(section):
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        p = os.path.join(SRC, section + ext)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(section)


def square_crop(img, bias):
    w, h = img.size
    s = min(w, h)
    left = (w - s) // 2
    top = int((h - s) * bias)
    return img.crop((left, top, left + s, top + s))


def process(section):
    bright, contrast, bias = TUNE[section]
    img = Image.open(find_src(section)).convert("L")
    img = square_crop(img, bias)
    img = img.resize((N, N), Image.LANCZOS)
    img = ImageOps.autocontrast(img, cutoff=1)
    img = ImageEnhance.Brightness(img).enhance(bright)
    img = ImageEnhance.Contrast(img).enhance(contrast)

    bw = img.convert("1")  # Floyd-Steinberg dither -> 1-bit
    mask = np.asarray(bw.convert("L"), dtype=np.float64)[..., None] / 255.0
    rgb = (FG * mask + BG * (1 - mask)).astype(np.uint8)
    out = Image.fromarray(rgb)
    dst = os.path.join(OUT, section + ".png")
    out.save(dst, optimize=True)
    print(f"{section:15s} -> {dst}  {os.path.getsize(dst)//1024}KB")


if __name__ == "__main__":
    for s in SECTIONS:
        process(s)
