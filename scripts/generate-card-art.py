import numpy as np
from PIL import Image
import os

OUT = "/Users/maesela/Repositories/maesela.tech/public/cards"
os.makedirs(OUT, exist_ok=True)

N = 760  # render resolution (kept modest so the dither grain stays coarse/rough)

# Duotone — a bold blue field with pale stipple, theme-independent like Hermes.
BG = np.array([26, 26, 232], dtype=np.float64)     # deep blue (the "ink")
FG = np.array([232, 235, 255], dtype=np.float64)    # pale, near-white


def coords():
    y, x = np.mgrid[0:N, 0:N]
    cx = cy = (N - 1) / 2
    xr = (x - cx) / (N / 2)
    yr = (y - cy) / (N / 2)
    r = np.sqrt(xr ** 2 + yr ** 2)
    th = np.arctan2(yr, xr)
    return xr, yr, r, th


def fbm(seed, octaves=5):
    """Fractal value noise in [0,1] via upsampled random layers."""
    rng = np.random.default_rng(seed)
    acc = np.zeros((N, N))
    amp = 1.0
    total = 0.0
    size = 4
    for _ in range(octaves):
        low = rng.random((size, size))
        layer = np.asarray(
            Image.fromarray((low * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC),
            dtype=np.float64,
        ) / 255.0
        acc += amp * layer
        total += amp
        amp *= 0.55
        size *= 2
    return acc / total


def sunburst(seed):
    xr, yr, r, th = coords()
    rays = 0.5 + 0.5 * np.cos(th * 34)
    rays = rays ** 1.5
    core = np.clip(1.2 - r * 2.2, 0, 1)
    g = np.clip(rays * np.clip(1.15 - r, 0, 1) + core, 0, 1)
    return g


def orb(seed):
    xr, yr, r, th = coords()
    # a lit sphere: brightness from a top-left light, dark rim
    lx, ly = -0.5, -0.55
    lam = np.clip(-(xr * lx + yr * ly) + 0.35, 0, 1)
    sphere = np.clip(1 - r ** 2, 0, 1) ** 0.5
    g = lam * sphere
    g += 0.25 * np.clip(1 - r * 1.1, 0, 1)  # soft glow
    return np.clip(g, 0, 1)


def rings(seed):
    xr, yr, r, th = coords()
    ring = 0.5 + 0.5 * np.cos(r * 26 - 0.6)
    ring *= np.clip(1.2 - r, 0, 1)
    warp = 0.5 + 0.5 * np.cos(th * 3)
    g = np.clip(ring * (0.6 + 0.6 * warp), 0, 1)
    return g


def starburst(seed):
    xr, yr, r, th = coords()
    rng = np.random.default_rng(seed)
    spikes = 0.5 + 0.5 * np.cos(th * 60 + 0.5)
    spikes = spikes ** 3
    falloff = np.clip(1.25 - r * 1.35, 0, 1)
    core = np.clip(1.4 - r * 5, 0, 1)
    g = np.clip(spikes * falloff + core, 0, 1)
    return g


def interference(seed):
    xr, yr, r, th = coords()
    a = 0.5 + 0.5 * np.sin((xr * 18) + (yr * 6))
    b = 0.5 + 0.5 * np.sin(np.sqrt((xr - 0.4) ** 2 + (yr + 0.3) ** 2) * 30)
    c = 0.5 + 0.5 * np.sin(np.sqrt((xr + 0.4) ** 2 + (yr - 0.2) ** 2) * 30)
    g = np.clip((a * 0.4 + b * 0.5 + c * 0.5), 0, 1)
    g *= (0.6 + 0.4 * np.clip(1 - r, 0, 1))
    return g


def grunge(g, seed):
    """Roughen a 0..1 field: fbm modulation, speckle, vignette, contrast."""
    xr, yr, r, th = coords()
    rng = np.random.default_rng(seed + 999)
    n = fbm(seed, 6)
    g = g * (0.45 + 0.95 * n)             # cloudy grunge
    g += 0.10 * (rng.random((N, N)) - 0.5)  # fine speckle
    scan = 0.5 + 0.5 * np.cos(np.mgrid[0:N, 0:N][0] * 3.14159 * 1.4)  # faint scanlines
    g *= (0.88 + 0.12 * scan)
    g *= np.clip(1.12 - r * 0.5, 0.15, 1)   # vignette
    # normalize + contrast (smoothstep-ish)
    g = (g - g.min()) / (g.max() - g.min() + 1e-6)
    g = np.clip((g - 0.5) * 1.5 + 0.5, 0, 1)
    g = g * g * (3 - 2 * g)
    return g


def duotone_dither(g):
    L = Image.fromarray((g * 255).astype(np.uint8), mode="L")
    bw = L.convert("1")  # Floyd–Steinberg dither → 1-bit
    mask = np.asarray(bw.convert("L"), dtype=np.float64)[..., None] / 255.0
    rgb = (FG * mask + BG * (1 - mask)).astype(np.uint8)
    return Image.fromarray(rgb, mode="RGB")


MOTIFS = {
    "experience": (sunburst, 11),
    "projects": (interference, 27),
    "education": (orb, 43),
    "certifications": (starburst, 61),
    "talks": (rings, 87),
}

for name, (fn, seed) in MOTIFS.items():
    g = fn(seed)
    g = grunge(g, seed)
    img = duotone_dither(g)
    path = os.path.join(OUT, f"{name}.png")
    img.save(path, optimize=True)
    print(name, path, os.path.getsize(path) // 1024, "KB")
