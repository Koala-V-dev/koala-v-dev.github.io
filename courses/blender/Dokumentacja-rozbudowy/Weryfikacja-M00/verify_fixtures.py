import bpy
import json
from pathlib import Path
root=Path('C:/xampp/htdocs/blender-course-development/revision')
result=[]
def close(a,b):return abs(a-b)<1e-5
try:
    for name,expected in [
        ('m00-01-start.blend',{'Cube':((2,2,2),(1,1,1))}),
        ('m00-03-skala-obiektu.blend',{'Cube':((4,2,2),(2,1,1))}),
        ('m00-04-polka-wynik.blend',{'Polka':((1.2,.3,.04),(1,1,1))}),
        ('m00-06-stol-wynik.blend',{'Blat':((2,1,.08),(1,1,1)),
            'Noga_PP':((.1,.1,.82),(1,1,1))})]:
        bpy.ops.wm.open_mainfile(filepath=str(root/'Resources'/name),load_ui=False,use_scripts=False)
        bpy.context.view_layer.update()
        for key,(dim,scale) in expected.items():
            o=bpy.data.objects[key]
            assert all(close(a,b) for a,b in zip(o.dimensions,dim)),(name,key,list(o.dimensions))
            assert all(close(a,b) for a,b in zip(o.scale,scale)),(name,key,list(o.scale))
        result.append({'file':name,'passed':True})
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    assert len(meshes)==5
    assert sum(len(o.data.polygons) for o in meshes)==30
    for o in meshes:
        import bmesh
        bm=bmesh.new();bm.from_mesh(o.data)
        assert all(e.is_manifold for e in bm.edges)
        bm.free()
        if o.name.startswith('Noga'):
            assert close(o.location.z-o.dimensions.z/2,0)
            assert close(o.location.z+o.dimensions.z/2,.82)
    assert json.loads((root/'Documentation'/'packing-proof.json').read_text())['reopened_without_external_image']
    (root/'Documentation'/'fixtures-verification.json').write_text(json.dumps({'checks':result,'table_manifold_parts':True,'packing_passed':True},indent=2),encoding='utf-8')
except Exception:
    import traceback
    (root/'Documentation'/'fixtures-verification-error.txt').write_text(traceback.format_exc(),encoding='utf-8')
