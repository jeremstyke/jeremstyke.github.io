from PIL import Image, ImageDraw, ImageFont, ImageFilter
import textwrap, os
W,H=1080,1920
F="/usr/share/fonts/opentype/inter/"
def font(n,s): return ImageFont.truetype(F+n,s)
XB=lambda s:font("InterDisplay-ExtraBold.otf",s); SB=lambda s:font("InterDisplay-SemiBold.otf",s); BL=lambda s:font("InterDisplay-Black.otf",s)
CAP="/home/claude/videos/cap/"; SC="/home/claude/videos/sc/"

def wrap(d,txt,f,maxw):
    words=txt.split(); lines=[]; cur=""
    for w in words:
        t=(cur+" "+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    lines.append(cur); return lines

def card(name,bg,lines,acc=None,small=None,foot=None,fg="#FFFFFF",accfg=None):
    im=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(im)
    y=640
    for txt,f,col in lines:
        for l in wrap(d,txt,f,920):
            d.text((80,y),l,font=f,fill=col); y+=int(f.size*1.12)
        y+=30
    if foot:
        d.rounded_rectangle((80,1380,80+d.textlength(foot,font=SB(48))+60,1470),radius=45,fill=accfg or "#FFD23F")
        d.text((110,1397),foot,font=SB(48),fill=bg)
    im.save(SC+name)

def screen(name,src,caption,crop=None,bg="#EEF2F8",capbg="#12173A",capfg="#FFFFFF",hl=None):
    s=Image.open(CAP+src).convert("RGB")
    if s.size!=(W,H): s=s.resize((W,int(s.size[1]*W/s.size[0])))
    im=Image.new("RGB",(W,H),bg)
    if crop:
        c=s.crop(crop); r=W-80; c=c.resize((r,int(c.size[1]*r/c.size[0])),Image.LANCZOS)
        sh=Image.new("RGBA",(c.size[0]+40,c.size[1]+40),(0,0,0,0)); ImageDraw.Draw(sh).rounded_rectangle((20,20,c.size[0]+20,c.size[1]+20),30,fill=(0,0,0,70)); sh=sh.filter(ImageFilter.GaussianBlur(18))
        y0=(H-c.size[1])//2+120
        im.paste(sh,(20,y0-10),sh); im.paste(c,(40,y0))
    else:
        im.paste(s,(0,0))
    d=ImageDraw.Draw(im); f=XB(66)
    lines=wrap(d,caption,f,880); h=len(lines)*78+70
    d.rounded_rectangle((60,150,W-60,150+h),radius=36,fill=capbg)
    y=185
    for l in lines: d.text((100,y),l,font=f,fill=capfg); y+=78
    im.save(SC+name)

# Hoplien
E,B,S="#12173A","#2F4BFF","#FFD23F"
card("h_0.png",E,[("Un lien trop long ?",BL(120),"#FFFFFF"),("Raccourcissez-le en 5 secondes, gratuitement.",SB(60),S)])
screen("h_1.png","h2.png","1. Collez votre long lien")
screen("h_2.png","h3.png","2. Hop, il est court !")
screen("h_3.png","h4.png","3. Le QR code est offert")
screen("h_4.png","h5.png","Vos contacts voient où ils vont. Sans pub.")
card("h_5.png",S,[("hoplien.fr",BL(150),E),("Gratuit, sans compte, fait en France.",SB(60),E)],foot="Lien dans la bio",fg=E,accfg=E)
# CVLibre
N,C="#0F1E3D","#1D4ED8"
card("c_0.png",N,[("Un CV pro en 3 minutes",BL(116),"#FFFFFF"),("Gratuit, sans inscription, avec l'IA.",SB(60),"#9DB7FF")])
screen("c_1.png","c1.png","Sans inscription, sans filigrane",capbg=C)
screen("c_2.png","c2.png","L'IA remplit votre CV",capbg=C)
screen("c_3.png","c3.png","33 modèles au choix",crop=(60,820,1020,1700),capbg=C)
screen("c_4.png","c4.png","Votre couleur en un clic",crop=(60,820,1020,1700),capbg=C)
card("c_5.png",C,[("CVLibre",BL(150),"#FFFFFF"),("Votre CV en PDF, gratuitement.",SB(60),"#FFFFFF")],foot="Lien dans la bio",accfg="#FFFFFF")
print("ok")
