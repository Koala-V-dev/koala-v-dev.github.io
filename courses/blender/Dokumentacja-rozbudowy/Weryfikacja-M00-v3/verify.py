import bpy,bmesh,json,hashlib,traceback
from pathlib import Path
root=Path('C:/xampp/htdocs/blender-course-development/revision/v3')
base=Path('C:/Users/rudek/Desktop/htdocs/public/courses/blender/Resources/stol-02-wynik.blend')
def signature(obj):
    payload=([list(v.co) for v in obj.data.vertices],[list(p.vertices) for p in obj.data.polygons],
             [list(row) for row in obj.matrix_world])
    return hashlib.sha256(json.dumps(payload).encode()).hexdigest()
def near(a,b):return abs(a-b)<1e-5
try:
    bpy.ops.wm.open_mainfile(filepath=str(base),load_ui=False,use_scripts=False)
    bpy.context.view_layer.update()
    original={o.name:signature(o) for o in bpy.context.scene.objects if o.type=='MESH'}
    checks=[]
    for filename,count in [('stol-03-rama.blend',7),('stol-04-polka.blend',8)]:
        bpy.ops.wm.open_mainfile(filepath=str(root/'Resources'/filename),load_ui=False,use_scripts=False)
        bpy.context.view_layer.update()
        meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
        assert len(meshes)==count
        assert all(signature(bpy.data.objects[name])==sig for name,sig in original.items())
        for o in meshes:
            bm=bmesh.new();bm.from_mesh(o.data)
            assert all(e.is_manifold for e in bm.edges),(filename,o.name)
            assert all(e.is_contiguous for e in bm.edges),(filename,o.name)
            assert all(f.calc_area()>1e-10 for f in bm.faces),(filename,o.name)
            bm.free()
        checks.append({'file':filename,'meshes':count,'original_parts_unchanged':True,'closed_meshes':True})
    shelf=bpy.data.objects['Polka'];beam=bpy.data.objects['Poprzeczka_P']
    assert all(near(a,b) for a,b in zip(shelf.dimensions,(1.72,.62,.04)))
    assert near(shelf.location.z-shelf.dimensions.z/2,beam.location.z+beam.dimensions.z/2)
    overlap=shelf.dimensions.x/2-(beam.location.x-beam.dimensions.x/2)
    assert near(overlap,.05)
    zs=sorted(set(round((shelf.matrix_world@v.co).z,6) for v in shelf.data.vertices))
    assert zs==[.26,.285,.3],zs
    assert len(shelf.data.vertices)==16 and len(shelf.data.polygons)==14
    checks.append({'shelf_support_overlap_m':overlap,'shelf_world_z_levels':zs,
                   'vertices':16,'faces':14,'bottom_thickness_m':.025})
    (root/'Documentation'/'verification.json').write_text(json.dumps({'checks':checks},indent=2),encoding='utf-8')
except Exception:
    (root/'Documentation'/'verification-error.txt').write_text(traceback.format_exc(),encoding='utf-8')
