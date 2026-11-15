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
