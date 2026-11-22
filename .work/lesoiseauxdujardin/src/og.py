# -*- coding: utf-8 -*-
# Images de partage (Open Graph) 1200x630, même style que Ma liste bébé (22 nov 2026)
from PIL import Image, ImageDraw, ImageFont
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
F_TITLE = os.path.join(HERE, 'fonts', 'bricolage-grotesque-latin-800-normal.woff')
F_TEXT = os.path.join(HERE, 'fonts', 'figtree-latin-600-normal.woff')
F_EMOJI = os.path.join(HERE, 'fonts', 'NotoColorEmoji.ttf')
SITE = 'Les oiseaux du jardin'; DOMAIN = 'lesoiseauxdujardin.fr'
BG = (245, 247, 242); INK = (31, 42, 34); MUTE = (86, 100, 90); BRAND = (63, 107, 58); ACCENT = (231, 163, 111)
TINTS = {'sauge': (228, 238, 221), 'ciel': (224, 236, 243), 'sable': (244, 234, 213), 'rose': (247, 226, 214), 'lilas': (236, 230, 243), 'mousse': (228, 238, 221), 'rouge': (247, 226, 214)}

def _f(p, sz):
    try: return ImageFont.truetype(p, sz)
    except Exception: return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', sz)

def _emoji(e, size):
    try:
        f = ImageFont.truetype(F_EMOJI, 109)
        im = Image.new('RGBA', (160, 160), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((10, 10), e, font=f, embedded_color=True)
        bb = im.getbbox()
        if not bb: return None
        im = im.crop(bb); r = size / max(im.size)
        return im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    except Exception:
        return None

def _wrap(d, text, font, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= width: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def card(out, title, emoji, kicker, tint=None):
    W, H = 1200, 630
    bg = TINTS.get(tint or '', BG)
    im = Image.new('RGB', (W, H), bg); d = ImageDraw.Draw(im)
    for x in range(640, W, 34):
        for y in range(0, H, 34):
            d.ellipse([x, y, x + 5, y + 5], fill=tuple(max(0, c - 14) for c in bg))
    d.rounded_rectangle([86, 96, 1124, 548], radius=40, fill=ACCENT)
    d.rounded_rectangle([70, 80, 1108, 532], radius=40, fill=(255, 255, 255))
    d.ellipse([890, 120, 1060, 290], fill=bg)
    em = _emoji(emoji, 100) if emoji else None
    if em: im.paste(em, (975 - em.width // 2, 205 - em.height // 2), em)
    size = 70
    while size > 40:
        ft = _f(F_TITLE, size); lines = _wrap(d, title, ft, 720)
        if len(lines) <= 3: break
        size -= 4
    y = 170
    for ln in lines[:3]:
        d.text((130, y), ln, font=ft, fill=INK); y += int(size * 1.12)
    fk = _f(F_TEXT, 30); tw = d.textlength(DOMAIN, font=fk)
    d.rounded_rectangle([130, 452, 130 + tw + 40, 500], radius=24, fill=BRAND)
    d.text((150, 457), DOMAIN, font=fk, fill=(255, 255, 255))
    if kicker: d.text((130 + tw + 64, 459), kicker, font=fk, fill=MUTE)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, optimize=True)

def make(out):
    card(out, SITE + ' : nourrir et observer les oiseaux', '🐦', '')

def make_article(out, title, emo_cat, tint=None):
    if os.path.exists(out): return
    m = re.match(r'^(\S+)\s+(.*)$', emo_cat or '')
    if m and not re.match(r'^[\wÀ-ſ]', m.group(1)): emo, cat = m.group(1), m.group(2)
    else: emo, cat = '', emo_cat or ''
    card(out, title, emo, cat, tint)
