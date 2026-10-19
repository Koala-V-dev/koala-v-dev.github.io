from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path('C:/xampp/htdocs/blender-course-development/revision/v3/Images')
font=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',22)
def make(name,crop,boxes=(),arrows=()):
    src=Image.open(root/(name+'-raw.png')).convert('RGB').crop(crop)
    im=Image.new('RGB',(src.width+45,src.height+30),'#101923');im.paste(src,(45,30))
    d=ImageDraw.Draw(im)
    def point(p):return(p[0]-crop[0]+45,p[1]-crop[1]+30)
    def badge(n,c):
        d.ellipse((c[0]-14,c[1]-14,c[0]+14,c[1]+14),fill='#ffd45a')
        d.text(c,str(n),font=font,anchor='mm',fill='#101923')
    for n,r in boxes:
        a=point(r[:2]);b=point(r[2:]);d.rectangle((*a,*b),outline='#ffd45a',width=3)
        badge(n,(max(15,a[0]-18),a[1]+15))
    for n,start,end in arrows:
        a=point(start);b=point(end)
        d.line((a,b),fill='#ffd45a',width=3)
        d.ellipse((b[0]-5,b[1]-5,b[0]+5,b[1]+5),outline='#ffd45a',width=2)
        badge(n,a)
    im.save(root/(name+'.png'),optimize=True)

make('polka-poprzeczka',(440,75,1555,780),boxes=[
    (1,(1307,114,1547,192)),(2,(1307,386,1547,461))])
make('polka-rama',(465,290,1130,775))
make('polka-sciana',(0,25,1335,810),boxes=[(1,(190,26,211,52))],
     arrows=[(2,(720,400),(830,470))])
make('polka-inset',(420,270,1260,810),arrows=[
    (1,(550,305),(649,301)),(2,(780,430),(830,490))])
make('polka-extrude',(420,270,1260,810),arrows=[
    (1,(550,305),(649,310)),(2,(780,430),(830,490))])
make('polka-wynik',(490,300,1120,715))

# Keep the same corner in both crops so a small change in height is readable.
main=Image.open(root/'polka-extrude.png').convert('RGB')
detail=Image.new('RGB',(main.width+265,max(main.height,570)),'#101923')
detail.paste(main,(0,0));d=ImageDraw.Draw(detail)
label=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',19)
for i,(source,title) in enumerate([('polka-inset','Po Inset'),('polka-extrude','Po Extrude')]):
    patch=Image.open(root/(source+'-raw.png')).crop((610,265,730,385)).resize((240,240))
    x=main.width+12;y=36+i*282
    detail.paste(patch,(x,y));d.text((x,y-27),title,font=label,fill='white')
detail.save(root/'polka-extrude.png',optimize=True)
