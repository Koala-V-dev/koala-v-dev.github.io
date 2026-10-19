import bpy,json,bmesh,traceback
from pathlib import Path
root=Path('C:/xampp/htdocs/blender-course-development/revision/v2')
try:
    checks=[]
    for filename,count in [('stol-01-blat-i-noga.blend',2),('stol-02-wynik.blend',5)]:
        bpy.ops.wm.open_mainfile(filepath=str(root/'Resources'/filename),load_ui=False,use_scripts=False)
        bpy.context.view_layer.update()
        objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
        assert len(objects)==count
        top=bpy.data.objects['Blat']
        assert all(abs(a-b)<1e-5 for a,b in zip(top.dimensions,(2,1,.08)))
        assert abs(top.location.z-.86)<1e-5
        for o in objects:
            bm=bmesh.new();bm.from_mesh(o.data)
            assert all(e.is_manifold for e in bm.edges)
            bm.free()
            assert all(abs(v-1)<1e-5 for v in o.scale)
            if o.name.startswith('Noga'):
                assert abs(abs(o.location.x)-.86)<1e-5
                assert abs(abs(o.location.y)-.36)<1e-5
                assert abs(o.location.z-.41)<1e-5
        checks.append({'file':filename,'meshes':count,'top_faces':len(top.data.polygons),'passed':True})
    assert checks[0]['top_faces']==6 and checks[1]['top_faces']>6
    (root/'Documentation'/'fixtures-qa.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
except Exception:
    (root/'Documentation'/'verify-error.txt').write_text(traceback.format_exc(),encoding='utf-8')
