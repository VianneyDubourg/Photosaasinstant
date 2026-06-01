#!/usr/bin/env python3
"""Generate PhotoInstant A4 landscape PDF brochure using reportlab."""

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.colors import HexColor

OUT = '/home/user/Photosaasinstant/docs/marketing/PhotoInstant_Brochure.pdf'

PAGE_W, PAGE_H = landscape(A4)  # ~841 x 595 pt
MARGIN = 28 * mm

BG = HexColor('#05050a')
BG2 = HexColor('#0a0a14')
NIGHT = HexColor('#111128')
PURPLE = HexColor('#a78bfa')
PURPLE_DARK = HexColor('#7c3aed')
WHITE = HexColor('#ffffff')
GRAY = HexColor('#9ca3af')
DIM = HexColor('#6b7280')
GREEN = HexColor('#4ade80')
RED = HexColor('#f87171')

c = canvas.Canvas(OUT, pagesize=landscape(A4))


def fill_bg(c, color=BG):
    c.setFillColor(color)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)


def accent_line(c, y, x1=MARGIN, x2=None, color=PURPLE_DARK, width=3):
    if x2 is None:
        x2 = PAGE_W - MARGIN
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y, x2, y)


def heading(c, text, x, y, size=36, color=WHITE, font='Helvetica-Bold'):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, text)


def body(c, text, x, y, size=12, color=GRAY, font='Helvetica', max_width=None):
    c.setFillColor(color)
    c.setFont(font, size)
    if max_width:
        # Simple word wrap
        words = text.split()
        line = ''
        line_y = y
        for word in words:
            test = (line + ' ' + word).strip()
            if c.stringWidth(test, font, size) <= max_width:
                line = test
            else:
                c.drawString(x, line_y, line)
                line_y -= size * 1.4
                line = word
        if line:
            c.drawString(x, line_y, line)
        return y - line_y
    else:
        c.drawString(x, y, text)
        return 0


def rounded_rect(c, x, y, w, h, radius=8, fill_color=NIGHT, stroke_color=None):
    c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    else:
        c.roundRect(x, y, w, h, radius, fill=1, stroke=0)


# =========== PAGE 1 — COVER ===========
fill_bg(c)

# Purple accent line at top
c.setStrokeColor(PURPLE_DARK)
c.setLineWidth(6)
c.line(0, PAGE_H - 8, PAGE_W, PAGE_H - 8)

# Big title
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 72)
c.drawCentredString(PAGE_W / 2, PAGE_H / 2 + 80, 'PhotoInstant')

# Purple accent bar under title
accent_line(c, PAGE_H / 2 + 68, PAGE_W / 2 - 120, PAGE_W / 2 + 120, width=4)

# Subtitle
c.setFillColor(GRAY)
c.setFont('Helvetica', 20)
c.drawCentredString(PAGE_W / 2, PAGE_H / 2 + 28,
                    'Instant professional photos for your event guests')

# Tagline
c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 18)
c.drawCentredString(PAGE_W / 2, PAGE_H / 2 - 16,
                    'They shoot. They scan. They post. Tonight.')

# Bottom footer
c.setFillColor(DIM)
c.setFont('Helvetica', 10)
c.drawCentredString(PAGE_W / 2, 22, 'vlogo.fr  ·  contact@vlogo.fr  ·  +61 400 000 000')

c.showPage()

# =========== PAGE 2 — THE PROBLEM ===========
fill_bg(c)

# Header strip
c.setFillColor(BG2)
c.rect(0, PAGE_H - 55, PAGE_W, 55, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 26)
c.drawString(MARGIN, PAGE_H - 38,
             'Your guests deserve better than a blurry selfie')
accent_line(c, PAGE_H - 58)

# Pain points
pain_y = PAGE_H - 100
pain_points = [
    ('1', 'Guests take bad photos → don\'t post → your venue gets zero social exposure',
     'Amateur photos nobody wants to share. Your brand is invisible online.'),
    ('2', 'Traditional photographers deliver photos 3 days later → the moment is dead',
     'By the time photos arrive, the energy is gone. Nobody posts a 3-day-old night out.'),
    ('3', 'Expensive photo booths → low quality → guests forget about them',
     'Props and filters don\'t replace real professional photography — and guests know it.'),
]

for num, title, desc in pain_points:
    # Number badge
    c.setFillColor(PURPLE_DARK)
    c.circle(MARGIN + 18, pain_y - 8, 18, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(MARGIN + 18, pain_y - 14, num)

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 15)
    c.drawString(MARGIN + 46, pain_y, title)
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 12)
    c.drawString(MARGIN + 46, pain_y - 20, desc)
    pain_y -= 90

# Right callout box
callout_x = PAGE_W * 0.62
callout_y = PAGE_H - 280
callout_w = PAGE_W - callout_x - MARGIN
callout_h = 180
rounded_rect(c, callout_x, callout_y, callout_w, callout_h,
             fill_color=HexColor('#1a0a2e'), stroke_color=PURPLE_DARK)
c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 13)
c.drawCentredString(callout_x + callout_w / 2, callout_y + callout_h - 24, 'RESEARCH INSIGHT')
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 36)
c.drawCentredString(callout_x + callout_w / 2, callout_y + callout_h - 70, '3×')
c.setFillColor(GRAY)
c.setFont('Helvetica', 11)
c.drawCentredString(callout_x + callout_w / 2, callout_y + callout_h - 92,
                    'more engagement on photos')
c.drawCentredString(callout_x + callout_w / 2, callout_y + callout_h - 108,
                    'shared within 1 hour of an event')
c.setFillColor(DIM)
c.setFont('Helvetica', 9)
c.drawCentredString(callout_x + callout_w / 2, callout_y + 14,
                    'vs photos shared 3 days later')

c.setFillColor(DIM)
c.setFont('Helvetica', 10)
c.drawCentredString(PAGE_W / 2, 22, 'vlogo.fr  ·  2 / 6')
c.showPage()

# =========== PAGE 3 — THE SOLUTION ===========
fill_bg(c)

c.setFillColor(BG2)
c.rect(0, PAGE_H - 55, PAGE_W, 55, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 26)
c.drawString(MARGIN, PAGE_H - 38, 'Professional photos. Available in 2 minutes.')
accent_line(c, PAGE_H - 58)

# 4 steps
steps = [
    ('\U0001f4f8', 'I shoot your event professionally',
     'Panasonic Lumix S5IIX. Full HD. Real photography, not a phone camera.'),
    ('\U0001f4f1', 'Guests scan the QR code at the bar',
     'QR code displayed on printed cards and signage throughout the venue.'),
    ('\U0001f50d', 'They find their photo instantly',
     'Browse by time or face. No app required. Works on any smartphone.'),
    ('⬇️', 'Pay 1 AUD · Download HD · Post immediately',
     'Secure payment. Instant full-resolution download. Posted while the night is alive.'),
]

step_cols = 2
step_w = (PAGE_W - MARGIN * 2 - 20) / step_cols
step_y_start = PAGE_H - 105

for i, (icon, title, desc) in enumerate(steps):
    col = i % 2
    row = i // 2
    sx = MARGIN + col * (step_w + 20)
    sy = step_y_start - row * 130

    rounded_rect(c, sx, sy - 100, step_w, 110, fill_color=NIGHT, stroke_color=PURPLE_DARK)

    c.setFillColor(PURPLE)
    c.setFont('Helvetica-Bold', 22)
    c.drawString(sx + 14, sy - 20, icon + '  ' + title)
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 11)
    # Wrap desc
    words = desc.split()
    line = ''
    ly = sy - 44
    for w in words:
        test = (line + ' ' + w).strip()
        if c.stringWidth(test, 'Helvetica', 11) <= step_w - 28:
            line = test
        else:
            c.drawString(sx + 14, ly, line)
            ly -= 16
            line = w
    if line:
        c.drawString(sx + 14, ly, line)

# Callout
callout_y = 60
rounded_rect(c, MARGIN, callout_y, PAGE_W - MARGIN * 2, 55,
             fill_color=HexColor('#1a0a2e'), stroke_color=PURPLE)
c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 13)
c.drawCentredString(PAGE_W / 2, callout_y + 34,
                    '"While other photographers deliver in 3 days,')
c.drawCentredString(PAGE_W / 2, callout_y + 17,
                    'your guests are posting tonight."')

c.setFillColor(DIM)
c.setFont('Helvetica', 10)
c.drawCentredString(PAGE_W / 2, 22, 'vlogo.fr  ·  3 / 6')
c.showPage()

# =========== PAGE 4 — WHY INSTANT MATTERS ===========
fill_bg(c)

c.setFillColor(BG2)
c.rect(0, PAGE_H - 55, PAGE_W, 55, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 26)
c.drawString(MARGIN, PAGE_H - 38, 'Instant = Virality for your venue')
accent_line(c, PAGE_H - 58)

mid_x = PAGE_W / 2
col_w = mid_x - MARGIN - 15

# LEFT column: With PhotoInstant
left_x = MARGIN
top_y = PAGE_H - 85

c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 16)
c.drawString(left_x, top_y, 'With PhotoInstant')
accent_line(c, top_y - 8, left_x, left_x + col_w, color=PURPLE, width=2)

with_items = [
    'Photos posted TONIGHT while the mood is alive',
    'Your venue tagged in dozens of posts',
    'Organic reach without paying for ads',
    'Guests remember the experience positively',
]
item_y = top_y - 30
for item in with_items:
    c.setFillColor(GREEN)
    c.setFont('Helvetica-Bold', 13)
    c.drawString(left_x, item_y, '✓')
    c.setFillColor(WHITE)
    c.setFont('Helvetica', 13)
    c.drawString(left_x + 20, item_y, item)
    item_y -= 36

# RIGHT column: With traditional photography
right_x = mid_x + 15

c.setFillColor(RED)
c.setFont('Helvetica-Bold', 16)
c.drawString(right_x, top_y, 'With traditional photography')
accent_line(c, top_y - 8, right_x, right_x + col_w, color=RED, width=2)

without_items = [
    'Photos arrive 3 days later',
    'The moment is gone — nobody posts',
    'Zero social media exposure',
    'Guests have already moved on',
]
item_y = top_y - 30
for item in without_items:
    c.setFillColor(RED)
    c.setFont('Helvetica-Bold', 13)
    c.drawString(right_x, item_y, '✗')
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 13)
    c.drawString(right_x + 20, item_y, item)
    item_y -= 36

# Vertical divider
c.setStrokeColor(DIM)
c.setLineWidth(1)
c.line(mid_x, top_y + 10, mid_x, item_y + 10)

# Bottom callout
callout_y = 62
rounded_rect(c, MARGIN, callout_y, PAGE_W - MARGIN * 2, 50,
             fill_color=HexColor('#0a1a0a'), stroke_color=GREEN)
c.setFillColor(GREEN)
c.setFont('Helvetica-Bold', 13)
c.drawCentredString(PAGE_W / 2, callout_y + 30,
                    'Every guest who posts = free advertising for your venue')
c.setFillColor(GRAY)
c.setFont('Helvetica', 11)
c.drawCentredString(PAGE_W / 2, callout_y + 13,
                    '50 guests posting their photo = 50 organic stories tagging your venue. Zero ad spend.')

c.setFillColor(DIM)
c.setFont('Helvetica', 10)
c.drawCentredString(PAGE_W / 2, 22, 'vlogo.fr  ·  4 / 6')
c.showPage()

# =========== PAGE 5 — PRICING ===========
fill_bg(c)

c.setFillColor(BG2)
c.rect(0, PAGE_H - 55, PAGE_W, 55, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 26)
c.drawString(MARGIN, PAGE_H - 38, 'Two ways to work together')
accent_line(c, PAGE_H - 58)

box_top = PAGE_H - 80
box_h = 300
box_gap = 20
box_w = (PAGE_W - MARGIN * 2 - box_gap) / 2

# LEFT: Budget
bx = MARGIN
by = box_top - box_h
rounded_rect(c, bx, by, box_w, box_h, fill_color=HexColor('#0a140a'),
             stroke_color=GREEN)
c.setFillColor(GREEN)
c.setFont('Helvetica-Bold', 20)
c.drawString(bx + 18, by + box_h - 36, 'Budget Booking')
accent_line(c, by + box_h - 46, bx + 14, bx + box_w - 14, color=GREEN, width=2)

budget_items = [
    ('Your investment:', 'Reduced photographer rate'),
    ('Your guests:', 'Pay 1 AUD per photo'),
    ('Perfect for:', 'Bars, clubs, regular nights'),
    ('Key benefit:', 'Photographer pays for itself via micro-payments'),
]
iy = by + box_h - 72
for label, val in budget_items:
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 11)
    c.drawString(bx + 18, iy, label)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(bx + 130, iy, val)
    iy -= 28

c.setFillColor(GREEN)
c.setFont('Helvetica-Bold', 12)
c.drawString(bx + 18, by + 22, '→ Get a quote: contact@vlogo.fr')

# RIGHT: Premium
px2 = MARGIN + box_w + box_gap
rounded_rect(c, px2, by, box_w, box_h, fill_color=HexColor('#0e0a20'),
             stroke_color=PURPLE_DARK)

# Premium badge
c.setFillColor(PURPLE_DARK)
c.roundRect(px2 + box_w - 100, by + box_h - 34, 88, 24, 6, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 10)
c.drawCentredString(px2 + box_w - 56, by + box_h - 24, '★ PREMIUM')

c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 20)
c.drawString(px2 + 18, by + box_h - 36, 'Full Service')
accent_line(c, by + box_h - 46, px2 + 14, px2 + box_w - 14, color=PURPLE_DARK, width=2)

premium_items = [
    ('Your investment:', 'Full photographer rate'),
    ('Your guests:', 'Photos completely FREE'),
    ('Perfect for:', 'Brand activations, corporate, luxury venues'),
    ('Key benefit:', 'Maximum guest satisfaction and social sharing'),
]
iy = by + box_h - 72
for label, val in premium_items:
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 11)
    c.drawString(px2 + 18, iy, label)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(px2 + 130, iy, val)
    iy -= 28

c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 12)
c.drawString(px2 + 18, by + 22, '→ Get a quote: contact@vlogo.fr')

# Note
c.setFillColor(DIM)
c.setFont('Helvetica', 11)
c.drawCentredString(PAGE_W / 2, by - 20,
                    'Custom packages available for festivals and recurring bookings')

c.setFillColor(DIM)
c.setFont('Helvetica', 10)
c.drawCentredString(PAGE_W / 2, 22, 'vlogo.fr  ·  5 / 6')
c.showPage()

# =========== PAGE 6 — CONTACT ===========
fill_bg(c)

# Purple accent at top
c.setStrokeColor(PURPLE_DARK)
c.setLineWidth(6)
c.line(0, PAGE_H - 8, PAGE_W, PAGE_H - 8)

c.setFillColor(WHITE)
c.setFont('Helvetica-Bold', 42)
c.drawCentredString(PAGE_W / 2, PAGE_H - 90, "Let's work together")
accent_line(c, PAGE_H - 102, PAGE_W / 2 - 100, PAGE_W / 2 + 100, width=3)

c.setFillColor(GRAY)
c.setFont('Helvetica', 16)
c.drawCentredString(PAGE_W / 2, PAGE_H - 138, 'Book me for your next event:')

contacts = [
    ('\U0001f4e7', 'Email', 'contact@vlogo.fr'),
    ('\U0001f4f8', 'Instagram', '@photoinstant'),
    ('\U0001f4de', 'Phone', '+61 400 000 000'),
    ('\U0001f310', 'Website', 'vlogo.fr'),
]
cy = PAGE_H - 195
for icon, label, val in contacts:
    c.setFillColor(PURPLE)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(MARGIN + 80, cy, icon + '  ' + label + ':')
    c.setFillColor(WHITE)
    c.setFont('Helvetica', 14)
    c.drawString(MARGIN + 220, cy, val)
    cy -= 38

# Big tagline
cy -= 20
rounded_rect(c, MARGIN, cy - 44, PAGE_W - MARGIN * 2, 58,
             fill_color=HexColor('#0e0a20'), stroke_color=PURPLE)
c.setFillColor(PURPLE)
c.setFont('Helvetica-Bold', 15)
c.drawCentredString(PAGE_W / 2, cy + 2,
                    '"Your guests will be posting before the night is over."')

# Footer
c.setFillColor(DIM)
c.setFont('Helvetica', 10)
c.drawCentredString(PAGE_W / 2, 22,
                    '© 2026 PhotoInstant  ·  ABN registered  ·  Australia  ·  6 / 6')
c.showPage()

c.save()
print(f'Saved: {OUT}')
