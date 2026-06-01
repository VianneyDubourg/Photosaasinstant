"""Generate 9:16 Instagram Story / Post (1080x1920px)"""
from PIL import Image, ImageDraw, ImageFont
import math, os

W, H = 1080, 1920
img = Image.new('RGB', (W, H), '#05050a')
draw = ImageDraw.Draw(img)

# --- Radial purple gradient from center ---
cx, cy = W // 2, H // 2
max_r = math.sqrt(cx**2 + cy**2)
for y in range(0, H, 2):
    for x in range(0, W, 2):
        d = math.sqrt((x - cx)**2 + (y - cy)**2)
        t = min(d / (max_r * 0.65), 1.0)
        r = int(5 + (5 - 5) * (1 - t))
        g = int(5 + (5 - 5) * (1 - t))
        b = int(10 + (30 - 10) * (1 - t))
        purple_mix = max(0, 1 - t) * 0.25
        r2 = int(r + purple_mix * 120)
        g2 = int(g + purple_mix * 20)
        b2 = int(b + purple_mix * 200)
        draw.rectangle([x, y, x+1, y+1], fill=(min(r2,255), min(g2,255), min(b2,255)))

# Try to get a bold-ish font
def get_font(size):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf',
        '/usr/share/fonts/liberation/LiberationSans-Bold.ttf',
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def get_regular(size):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf',
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def centered_text(draw, y, text, font, color):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((W - w) // 2, y), text, font=font, fill=color)
    return bbox[3] - bbox[1]

def text_h(draw, text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[3] - bb[1]

WHITE = '#ffffff'
PURPLE = '#a78bfa'
GRAY = '#9ca3af'
BG = '#05050a'

# --- TOP SECTION ---
y = 110
font_huge = get_font(148)
font_big = get_font(90)
font_med = get_font(54)
font_small = get_font(40)
font_tiny = get_font(32)
font_micro = get_font(28)

centered_text(draw, y, 'YOUR EVENT.', font_huge, WHITE)
y += text_h(draw, 'YOUR EVENT.', font_huge) + 10
centered_text(draw, y, 'INSTANTLY.', font_huge, PURPLE)
y += text_h(draw, 'INSTANTLY.', font_huge) + 60

# --- BULLET POINTS ---
bullets = [
    'Scan the QR code at the bar',
    'Find your photo — HD quality',
    'Pay 1 AUD · Download instantly',
]
bullet_x = 120
for b in bullets:
    # Purple dot
    dot_r = 14
    draw.ellipse([bullet_x, y + 12, bullet_x + dot_r*2, y + 12 + dot_r*2], fill=PURPLE)
    draw.text((bullet_x + dot_r*2 + 20, y), b, font=font_med, fill=WHITE)
    y += text_h(draw, b, font_med) + 28

y += 20
centered_text(draw, y, 'No app.  No account.  No waiting.', font_big, GRAY)
y += text_h(draw, 'No app.  No account.  No waiting.', font_big) + 50

# --- SEPARATOR ---
line_pad = 80
draw.rectangle([line_pad, y, W - line_pad, y + 3], fill=PURPLE)
y += 3 + 70

# --- BOTTOM SECTION: QR box left, price+url right ---
section_y = y
qr_size = 300
qr_x = 100
qr_y = section_y
draw.rectangle([qr_x, qr_y, qr_x + qr_size, qr_y + qr_size], fill=WHITE, outline=WHITE)
# QR placeholder inner border
draw.rectangle([qr_x + 10, qr_y + 10, qr_x + qr_size - 10, qr_y + qr_size - 10], outline='#cccccc', width=3)
# SCAN ME text
scan_font = get_font(44)
bb = draw.textbbox((0, 0), 'SCAN ME', font=scan_font)
sw = bb[2] - bb[0]
sh = bb[3] - bb[1]
draw.text((qr_x + (qr_size - sw)//2, qr_y + (qr_size - sh)//2), 'SCAN ME', font=scan_font, fill='#05050a')

# Right side: price
right_x = qr_x + qr_size + 80
price_font = get_font(210)
price_y = section_y - 30
draw.text((right_x, price_y), '1', font=price_font, fill=WHITE)
bb1 = draw.textbbox((0, 0), '1', font=price_font)
dollar_font = get_font(110)
draw.text((right_x + bb1[2] - bb1[0] - 10, price_y + 20), '$', font=dollar_font, fill=PURPLE)
aud_y = price_y + (bb1[3] - bb1[1]) - 10
draw.text((right_x, aud_y), 'AUD per photo', font=font_small, fill=GRAY)
url_y = aud_y + text_h(draw, 'AUD per photo', font_small) + 24
draw.text((right_x, url_y), 'photoinstant.au', font=font_med, fill=PURPLE)

# Very bottom text
bottom_y = H - 80
centered_text(draw, bottom_y, 'Available at the event  ·  Tonight only', font_micro, GRAY)

out_path = '/home/user/Photosaasinstant/docs/marketing/post_9x16.png'
img.save(out_path, 'PNG')
print(f'Saved: {out_path}')
