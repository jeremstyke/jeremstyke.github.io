# -*- coding: utf-8 -*-
# Contenu du site « Les oiseaux du jardin » (vouvoiement)
GUIDES = []
A = 'rel="sponsored nofollow noopener" target="_blank"'
CATS = ['Nourrir', 'Mangeoires', 'Nichoirs', 'Observer']

def g(slug, title, h1, desc, body, faq=None, short=None, cat='Nourrir'):
    GUIDES.append(dict(slug=slug, title=title, h1=h1, desc=desc, body=body, faq=faq or [], short=short or h1, cat=cat))
