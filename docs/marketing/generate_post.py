#!/usr/bin/env python3
"""Generate 9:16 Instagram Story / Post (1080x1920px) for PhotoInstant."""

from PIL import Image, ImageDraw, ImageFont
import math
import os
import random

W, H = 1080, 1920
BG_COLOR = (5, 5, 10)

img = Image.new('RGB', (W, H), BG_COLOR)
draw = ImageDraw.Draw(img)

# --- Radial purple gradient from center ---
cx, cy = W // 2, H // 3
max_r = math.sqrt(cx**2 + cy**2)
for py in range(0, H, 3):
    for px in range(0, W, 3):
        d = math.sqrt((px - cx)**2 + (py - cy)**2)
        t = min(d / (max_r * 0.9), 1.0)
        purple_mix = max(0.0, 1 - t) * 0.35
        r2 = int(5 + purple_mix * 80)
        g2 = int(5 + purple_mix * 10)
        b2 = int(10 + purple_mix * 160)
        draw.rectangle([px, py, px + 2, py + 2],
                       fill=(min(r2, 255), min(g2, 255), min(b2, 255)))

WHITE = (255, 255, 255)
PURPLE = (167, 139, 250)
PURPLE_DARK = (124, 58, 237)
GRAY = (156, 163, 175)
DIM = (80, 80, 110)


def get_font(size, bold=True):
    bold_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf',
        '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
    ]
    regular_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf',
    ]
    search = bold_paths + regular_paths if bold else regular_paths + bold_paths
    for p in search:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def text_size(draw, text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0], bb[3] - bb[1]


def centered_text(draw, y, text, font, color, thickness=0):
    tw, th = text_size(draw, text, font)
    x = (W - tw) // 2
    if thickness > 0:
        for dx in range(-thickness, thickness + 1):
            for dy in range(-thickness, thickness + 1):
                if dx * dx + dy * dy <= thickness * thickness:
                    draw.text((x + dx, y + dy), text, font=font, fill=color)
    else:
        draw.text((x, y), text, font=font, fill=color)
    return th


# ---- Fonts ----
font_huge = get_font(148)
font_big = get_font(90)
font_med = get_font(54)
font_small = get_font(42)
font_tiny = get_font(34)
font_micro = get_font(28)

# ---- TOP: YOUR EVENT. / INSTANTLY. ----
y = 110
_, h = text_size(draw, 'YOUR EVENT.', font_huge)
centered_text(draw, y, 'YOUR EVENT.', font_huge, WHITE, thickness=2)
y += h + 10
centered_text(draw, y, 'INSTANTLY.', font_huge, PURPLE, thickness=2)
y += h + 60

# ---- BULLET POINTS ----
bullets = [
    'Scan the QR code at the bar',
    'Find your photo — HD quality',
    'Pay 1 AUD · Download instantly',
]
bullet_x = 110
for b in bullets:
    dot_r = 13
    dot_cy = y + 20
    draw.ellipse([bullet_x, dot_cy - dot_r, bullet_x + dot_r * 2, dot_cy + dot_r],
                 fill=PURPLE)
    draw.text((bullet_x + dot_r * 2 + 22, y), b, font=font_med, fill=WHITE)
    _, bh = text_size(draw, b, font_med)
    y += bh + 26

y += 20
# Tagline
centered_text(draw, y, 'No app.  No account.  No waiting.', font_big, GRAY)
_, tagh = text_size(draw, 'No app.', font_big)
y += tagh + 55

# ---- SEPARATOR ----
draw.rectangle([60, y, W - 60, y + 4], fill=PURPLE_DARK)
y += 4 + 65

# ---- BOTTOM: QR left + Price right ----
section_y = y
qr_size = 310
qr_x = 90
qr_y = section_y

# White QR placeholder box
draw.rectangle([qr_x, qr_y, qr_x + qr_size, qr_y + qr_size], fill=WHITE)

# Draw QR-like pattern
random.seed(42)
inner_margin = 30
cell = 12
data_start_x = qr_x + inner_margin + 80  # offset past finder patterns
data_start_y = qr_y + inner_margin + 80

# Finder pattern helper
def finder(fx, fy):
    draw.rectangle([fx, fy, fx + 70, fy + 70], fill=BG_COLOR)
    draw.rectangle([fx + 10, fy + 10, fx + 60, fy + 60], fill=WHITE)
    draw.rectangle([fx + 18, fy + 18, fx + 52, fy + 52], fill=BG_COLOR)

finder(qr_x + inner_margin, qr_y + inner_margin)
finder(qr_x + qr_size - inner_margin - 70, qr_y + inner_margin)
finder(qr_x + inner_margin, qr_y + qr_size - inner_margin - 70)

# Data modules
for i in range(data_start_x, qr_x + qr_size - inner_margin, cell):
    for j in range(data_start_y, qr_y + qr_size - inner_margin - 20, cell):
        if random.random() > 0.5:
            draw.rectangle([i, j, i + cell - 2, j + cell - 2], fill=BG_COLOR)

# "SCAN ME" text centered in white area
scan_font = get_font(36)
sw, sh = text_size(draw, 'SCAN ME', scan_font)
draw.text((qr_x + (qr_size - sw) // 2, qr_y + qr_size + 14),
          'SCAN ME', font=scan_font, fill=PURPLE)

# ---- Right: price ----
right_x = qr_x + qr_size + 70
price_font = get_font(200)
dollar_font = get_font(100)

price_y = section_y - 20
pw, ph = text_size(draw, '1', price_font)
draw.text((right_x, price_y), '1', font=price_font, fill=WHITE)
draw.text((right_x + pw + 5, price_y + 20), '$', font=dollar_font, fill=PURPLE)

aud_y = price_y + ph - 10
_, audh = text_size(draw, 'AUD per photo', font_small)
draw.text((right_x, aud_y), 'AUD per photo', font=font_small, fill=GRAY)

url_y = aud_y + audh + 22
draw.text((right_x, url_y), 'vlogo.fr', font=font_med, fill=PURPLE)

# ---- Very bottom ----
bottom_text = 'Available at the event  ·  Tonight only'
centered_text(draw, H - 75, bottom_text, font_micro, DIM)

out_path = '/home/user/Photosaasinstant/docs/marketing/post_9x16.png'
img.save(out_path, 'PNG')
print(f'Saved: {out_path}')
