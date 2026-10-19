"""Continue the existing table; capture cumulative states with Blender's UI API."""
import bpy, bmesh, json, hashlib, traceback
from pathlib import Path
from mathutils import Euler
from math import radians
ROOT=Path('C:/xampp/htdocs/blender-course-development/revision/v3')
SOURCE=Path('C:/Users/rudek/Desktop/htdocs/public/courses/blender/Resources/stol-02-wynik.blend')
for sub in ('Pages/Moduł 0','Images','Resources','Documentation'):
    (ROOT/sub).mkdir(parents=True,exist_ok=True)
before=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
bpy.context.preferences.view.show_splash=False
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.open_mainfile(filepath=str(SOURCE),load_ui=False,use_scripts=False)
proof=[]

def context():
    window=bpy.context.window_manager.windows[0]
    area=next(a for a in window.screen.areas if a.type=='VIEW_3D')
    region=next(r for r in area.regions if r.type=='WINDOW')
    return window,area,region

def view(distance=4.2, location=(0,0,.5), angle=65,sidebar=True):
    w,a,r=context();s=a.spaces.active
    s.show_region_ui=sidebar
    s.region_3d.view_distance=distance
    s.region_3d.view_location=location
    s.region_3d.view_rotation=Euler((radians(angle),0,radians(45)),'XYZ').to_quaternion()
    s.region_3d.view_perspective='PERSP'

def cube(name,dim,loc):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.mesh.primitive_cube_add(size=2,location=loc)
    obj=bpy.context.object;obj.name=name;obj.dimensions=dim
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return obj

def first_beam():
    view()
    cube('Poprzeczka_P',(.1,.62,.08),(.86,0,.22))

def second_beam():
    obj=bpy.context.object
    new=obj.copy();new.data=obj.data.copy();new.name='Poprzeczka_L'
    bpy.context.scene.collection.objects.link(new);new.location.x=-.86
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'Resources'/'stol-03-rama.blend'))

def shelf():
    cube('Polka',(1.72,.62,.04),(0,0,.28))
    w,a,r=context()
    with bpy.context.temp_override(window=w,area=a,region=r):
        bpy.ops.view3d.localview(frame_selected=False)
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.context.tool_settings.mesh_select_mode=(False,False,True)
        bpy.ops.mesh.select_all(action='DESELECT')
        bm=bmesh.from_edit_mesh(bpy.context.object.data)
        bm.normal_update()
        for f in bm.faces:
            if f.normal.z>.9:f.select_set(True)
        bm.select_flush_mode();bmesh.update_edit_mesh(bpy.context.object.data)
    view(2.4,(0,0,.28),55,False)

def inset():
    bpy.ops.mesh.inset(thickness=.02,depth=0,use_even_offset=True)

def extrude():
    bpy.ops.mesh.extrude_region_move(TRANSFORM_OT_translate={'value':(0,0,-.015)})

def save():
    bpy.ops.object.mode_set(mode='OBJECT')
    w,a,r=context()
    with bpy.context.temp_override(window=w,area=a,region=r):
        bpy.ops.view3d.localview(frame_selected=False)
    view(4.2,(0,0,.45),78,False)
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'Resources'/'stol-04-polka.blend'))
    obj=bpy.data.objects['Polka']
    assert len(obj.data.vertices)==16 and len(obj.data.polygons)==14
    proof.append({'shelf_vertices':len(obj.data.vertices),'shelf_faces':len(obj.data.polygons),
                  'shelf_dimensions':list(obj.dimensions),'shelf_location':list(obj.location)})
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==before
    (ROOT/'Documentation'/'build-proof.json').write_text(json.dumps({
        'source_unchanged':True,'source_sha256':before,'checks':proof},indent=2),encoding='utf-8')

def snap(name):
    bpy.ops.screen.screenshot(filepath=str(ROOT/'Images'/(name+'-raw.png')))

steps=[first_beam,lambda:snap('polka-poprzeczka'),second_beam,
       lambda:snap('polka-rama'),shelf,lambda:snap('polka-sciana'),
       inset,lambda:snap('polka-inset'),extrude,lambda:snap('polka-extrude'),
       save,lambda:snap('polka-wynik')]

def tick():
    try:
        if not steps:return None
        w,a,r=context()
        with bpy.context.temp_override(window=w,area=a,region=r):steps.pop(0)()
        return 1.5
    except Exception:
        (ROOT/'Documentation'/'error.txt').write_text(traceback.format_exc(),encoding='utf-8')
        return None

bpy.app.timers.register(tick,first_interval=4)
