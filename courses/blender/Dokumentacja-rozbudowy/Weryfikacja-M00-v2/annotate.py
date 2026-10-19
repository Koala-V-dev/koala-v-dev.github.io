from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path('C:/xampp/htdocs/blender-course-development/revision/v2/Images')
font=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',22)
def annotate(name,crop,boxes):
    src=Image.open(root/(name+'-raw.png')).convert('RGB').crop(crop)
    im=Image.new('RGB',(src.width+45,src.height+30),'#101923');im.paste(src,(45,30))
    d=ImageDraw.Draw(im)
    for n,r in boxes:
        x1,y1,x2,y2=r
        x1+=45-crop[0];x2+=45-crop[0];y1+=30-crop[1];y2+=30-crop[1]
        d.rectangle((x1,y1,x2,y2),outline='#ffd45a',width=3)
        cx=max(15,x1-18);cy=y1+15
        d.ellipse((cx-14,cy-14,cx+14,cy+14),fill='#ffd45a')
        d.text((cx,cy),str(n),font=font,anchor='mm',fill='#101923')
    im.save(root/(name+'.png'),optimize=True)
annotate('stol-blat-skala',(430,75,1555,700),[
    (1,(1307,114,1547,192)),(2,(1307,302,1547,378)),(3,(1307,386,1547,461))])
annotate('stol-blat-apply',(1295,295,1555,474),[
    (1,(1307,302,1547,378)),(2,(1307,386,1547,461))])
annotate('stol-pierwsza-noga',(430,75,1555,760),[
    (1,(1307,114,1547,192)),(2,(1307,386,1547,461))])
annotate('stol-cztery-nogi',(410,285,1160,780),[])
annotate('stol-edit-bevel',(0,25,1575,850),[
    (1,(173,26,193,52)),(2,(748,625,843,703))])
