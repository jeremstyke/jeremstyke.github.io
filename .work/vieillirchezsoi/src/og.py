# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os
def make(out):
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), '#F6F3EC'); d = ImageDraw.Draw(im)
    d.rectangle([0, H - 140, W, H], fill='#2F6B57')
    def font(sz):
        for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
            if os.path.exists(p): return ImageFont.truetype(p, sz)
        return ImageFont.load_default()
    d.text((80, 170), 'Vieillir chez soi', font=font(96), fill='#22302B')
    d.text((80, 300), "Guides pour adapter", font=font(44), fill='#55635D')
    d.text((80, 360), "la maison des seniors", font=font(44), fill='#55635D')
    d.text((80, H - 100), 'Salle de bains  ·  Déplacements  ·  Sécurité', font=font(38), fill='#F6F3EC')
    im.save(out, optimize=True)

def make_article(out, title, cat):
    import re, textwrap
    if os.path.exists(out): return
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), '#F6F3EC'); d = ImageDraw.Draw(im)
    def font(sz):
        p = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
        return ImageFont.truetype(p, sz) if os.path.exists(p) else ImageFont.load_default()
    cat = re.sub(r'[^\u0000-￿]|[☀-➿️]', '', cat).strip()
    d.rounded_rectangle([80, 70, 80 + 24 * len(cat) + 60, 130], 30, fill='#E3EEE6')
    d.text((110, 82), cat, font=font(34), fill='#2F6B57')
    y = 180
    for line in textwrap.wrap(title, 26)[:4]:
        d.text((80, y), line, font=font(64), fill='#22302B'); y += 82
    d.rectangle([0, H - 90, W, H], fill='#2F6B57')
    d.text((80, H - 68), 'Vieillir chez soi', font=font(40), fill='#F6F3EC')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, optimize=True)
