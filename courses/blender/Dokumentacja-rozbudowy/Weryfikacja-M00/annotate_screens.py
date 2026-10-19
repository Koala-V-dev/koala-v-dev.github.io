"""Crop real UI captures and add numbered outlines. Never redraw interface content."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path('C:/xampp/htdocs/blender-course-development/revision/Images')
font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',20)
bold=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',22)
yellow='#ffd45a'

def output(src,name,crop=None,boxes=(),legend='',max_width=1500):
    im=Image.open(root/src).convert('RGB')
    ox,oy=0,0
    if crop:
        ox,oy=crop[:2];im=im.crop(crop)
    # A margin lets numbers sit outside the control, never over its label.
    padded=Image.new('RGB',(im.width+45,im.height+30),'#101923')
    padded.paste(im,(45,30));im=padded
    draw=ImageDraw.Draw(im)
    for num,rect in boxes:
        x1,y1,x2,y2=rect
        rect=(x1-ox+45,y1-oy+30,x2-ox+45,y2-oy+30)
        draw.rounded_rectangle(rect,radius=5,outline=yellow,width=3)
        cx=max(15,rect[0]-18);cy=max(15,rect[1]+16)
        draw.ellipse((cx-14,cy-14,cx+14,cy+14),fill=yellow,outline='#151b25',width=2)
        draw.text((cx,cy-1),str(num),font=bold,fill='#111827',anchor='mm')
    if im.width>max_width:
        im=im.resize((max_width,round(im.height*max_width/im.width)),Image.Resampling.LANCZOS)
    if legend:
        canvas=Image.new('RGB',(im.width,im.height+64),'#101923')
        canvas.paste(im,(0,0));d=ImageDraw.Draw(canvas)
        d.text((18,im.height+17),legend,font=font,fill='#f4f6fb')
        im=canvas
    im.save(root/(name+'.png'),optimize=True)

output('m00-ui-raw.png','m00-ui',boxes=[
 (1,(56,78,1570,910)),(2,(1582,28,1912,201)),(3,(1582,207,1912,984)),
 (4,(4,919,1570,985)),(5,(251,1,1127,26))],
 legend='1 Widok 3D   2 Outliner   3 Properties   4 Timeline   5 Workspaces')
output('m00-item-raw.png','m00-item',crop=(1290,70,1575,478),
 boxes=[(1,(1548,80,1572,133)),(2,(1308,303,1547,376)),(3,(1308,387,1547,461))],
 legend='',max_width=1000)
output('m00-item-raw.png','m00-navigation',crop=(1200,75,1305,288),
 boxes=[(1,(1205,78,1297,170)),(2,(1259,176,1288,201)),(3,(1259,207,1288,230))])
output('m00-front-raw.png','m00-front',crop=(45,65,1305,800),
 boxes=[(1,(61,81,240,139)),(2,(1202,77,1300,171))],
 legend='1 Front Orthographic: widok od przodu   2 Osie widoku')
output('m00-object-raw.png','m00-object',crop=(40,24,1575,880),
 boxes=[(1,(52,25,162,53)),(2,(1305,300,1549,463))],legend='1 Object Mode   2 Scale i Dimensions')
output('m00-edit-raw.png','m00-edit',crop=(0,25,1050,800),
 boxes=[(1,(48,26,146,52)),(2,(148,26,211,52))],legend='1 Edit Mode   2 Vertex / Edge / Face')
for state in ('before','after'):
 output(f'm00-scale-{state}-raw.png',f'm00-scale-{state}',crop=(1298,75,1555,473),
  boxes=[(1,(1307,301,1547,378)),(2,(1307,386,1547,461))])
 output(f'm00-shelf-{state}-raw.png',f'm00-shelf-{state}',crop=(480,72,1557,700),
  boxes=[(1,(1307,113,1547,192)),(2,(1307,386,1547,461))],
  legend='1 Location: pozycja środka   2 Dimensions: rozmiar')
output('m00-table-raw.png','m00-table',crop=(400,70,1915,820),
 boxes=[(1,(1584,87,1908,191)),(2,(1307,386,1547,461))],legend='1 Pięć części   2 Wymiary zaznaczonego blatu')
output('m00-units-ui.jpg','m00-units',crop=(1578,230,1918,665),
 boxes=[(1,(1581,377,1610,412)),(2,(1620,441,1905,519))])
output('m00-packed-table-ui.jpg','m00-packed-table',crop=(400,48,1575,855),
 boxes=[(1,(1510,49,1530,73))],legend='1 Material Preview   Model pozostaje stołem z pięciu części')
output('m00-pack-menu-raw.png','m00-pack-menu',crop=(5,747,223,982),
 boxes=[(1,(18,800,214,824))])
