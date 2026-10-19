"""Creates original course fixtures and real Blender UI screenshots, not mockups."""
import bpy
import json
from pathlib import Path
from mathutils import Euler
from math import radians

ROOT = Path('C:/xampp/htdocs/blender-course-development/revision')
IMG = ROOT / 'Images'
RES = ROOT / 'Resources'
for p in (IMG, RES): p.mkdir(parents=True, exist_ok=True)
proof = []
bpy.context.preferences.filepaths.save_version = 0
bpy.context.preferences.view.show_splash = False

def viewport():
    return next(a for a in bpy.context.screen.areas if a.type == 'VIEW_3D')

def setup_view(distance=7, sidebar=True):
    a = viewport()
    s = a.spaces.active
    s.show_region_ui = sidebar
    s.region_3d.view_distance = distance
    s.region_3d.view_location = (0, 0, 0.65)
    s.region_3d.view_rotation = Euler((radians(65),0,radians(45)), 'XYZ').to_quaternion()
    s.region_3d.view_perspective = 'PERSP'
    s.overlay.show_stats = True
    s.shading.type = 'SOLID'
    return a

def base():
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    bpy.context.scene.unit_settings.system = 'METRIC'
    bpy.context.scene.unit_settings.scale_length = 1
    setup_view()

def cube(name, dimensions=(2,2,2), location=(0,0,0), apply=True):
    bpy.ops.mesh.primitive_cube_add(size=2, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = dimensions
    if apply:
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return ob

def save(name):
    bpy.ops.wm.save_as_mainfile(filepath=str(RES / name))

def snap(name):
    bpy.ops.screen.screenshot(filepath=str(IMG / (name + '-raw.png')))

def cube_start():
    base(); cube('Cube'); setup_view(7)
    save('m00-01-start.blend')

def front():
    a=viewport()
    with bpy.context.temp_override(area=a, region=next(r for r in a.regions if r.type=='WINDOW')):
        bpy.ops.view3d.view_axis(type='FRONT')

def edit():
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.context.tool_settings.mesh_select_mode=(True,False,False)
    bpy.ops.mesh.select_all(action='SELECT')

def scale_bad():
    if bpy.context.object.mode!='OBJECT': bpy.ops.object.mode_set(mode='OBJECT')
    bpy.context.object.scale=(2,1,1)
    setup_view(8)
    save('m00-03-skala-obiektu.blend')

def scale_applied():
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    proof.append({'case':'apply_scale','dimensions':list(bpy.context.object.dimensions),
                  'scale':list(bpy.context.object.scale)})

def shelf():
    base(); cube('Polka', (1.2,0.3,0.04),(0,0,1.4),apply=False)
    setup_view(2.8)
    viewport().spaces.active.region_3d.view_location=(0,0,1.4)
    save('m00-04-polka-przed-apply.blend')

def shelf_done():
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    save('m00-04-polka-wynik.blend')
    proof.append({'case':'shelf','dimensions':list(bpy.context.object.dimensions),
                  'location':list(bpy.context.object.location),'scale':list(bpy.context.object.scale)})

def table():
    base()
    top=cube('Blat',(2,1,.08),(0,0,.86))
    for name,x,y in [('Noga_PP',.86,-.36),('Noga_LP',-.86,-.36),
                     ('Noga_PT',.86,.36),('Noga_LT',-.86,.36)]:
        cube(name,(.1,.1,.82),(x,y,.41))
    bpy.ops.object.select_all(action='DESELECT')
    top.select_set(True);bpy.context.view_layer.objects.active=top
    setup_view(4.4)
    save('m00-06-stol-wynik.blend')
    proof.append({'case':'table','parts':[
        {'name':o.name,'dimensions':list(o.dimensions),'location':list(o.location)}
        for o in bpy.context.scene.objects if o.type=='MESH']})

def label_scene():
    # Prepare the image only. The visible table stays intact.
    im=bpy.data.images.new('Etykieta_kurs',width=256,height=256)
    im.generated_color=(.05,.55,.25,1)
    im.filepath_raw=str(RES/'etykieta-kurs.png')
    im.file_format='PNG';im.save()
    bpy.data.images.remove(im)

def finish():
    (ROOT/'Documentation'/'fixtures-proof.json').write_text(json.dumps(proof,indent=2),encoding='utf-8')

# Two separate ticks ensure the UI redraws before a screenshot is captured.
def overview():
    bpy.context.scene.unit_settings.system='METRIC'
    setup_view(8,sidebar=False)

def item_view():
    viewport().spaces.active.show_region_ui=True

steps=[overview,lambda:snap('m00-ui'),item_view,lambda:snap('m00-item'),
       cube_start,lambda:snap('m00-object'),front,lambda:snap('m00-front'),
       edit,lambda:snap('m00-edit'),scale_bad,lambda:snap('m00-scale-before'),
       scale_applied,lambda:snap('m00-scale-after'),shelf,lambda:snap('m00-shelf-before'),
       shelf_done,lambda:snap('m00-shelf-after'),table,lambda:snap('m00-table'),label_scene,finish]

def tick():
    try:
        if not steps:return None
        steps.pop(0)()
        return 1.0
    except Exception:
        import traceback
        (ROOT/'Documentation'/'assets-error.txt').write_text(traceback.format_exc(),encoding='utf-8')
        return None

bpy.app.timers.register(tick, first_interval=12)
