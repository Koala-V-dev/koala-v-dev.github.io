"""Pack an external image without replacing the model. Validate after relocation."""
import bpy
import json
import hashlib
import shutil
from pathlib import Path

root=Path('C:/xampp/htdocs/blender-course-development/revision')
res=root/'Resources'
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.open_mainfile(filepath=str(res/'m00-06-stol-wynik.blend'),load_ui=False,use_scripts=False)

def signature():
    values=[]
    for o in sorted(bpy.context.scene.objects,key=lambda o:o.name):
        if o.type=='MESH':
            values.append((o.name,[list(row) for row in o.matrix_world],
                [list(v.co) for v in o.data.vertices],
                [list(p.vertices) for p in o.data.polygons]))
    return hashlib.sha256(json.dumps(values).encode()).hexdigest()

geometry=signature()
top=bpy.data.objects['Blat']
im=bpy.data.images.load(str(res/'etykieta-kurs.png'),check_existing=False)
mat=bpy.data.materials.new('M00_obraz_testowy');mat.use_nodes=True
tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=im
mat.node_tree.links.new(tex.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
top.data.materials.clear();top.data.materials.append(mat)
assert signature()==geometry
im.filepath='//etykieta-kurs.png'
bpy.ops.wm.save_as_mainfile(filepath=str(res/'m00-05-zaleznosci-start.blend'))
assert not im.packed_file
graph_before=[(l.from_node.bl_idname,l.from_socket.name,l.to_node.bl_idname,l.to_socket.name)
              for l in mat.node_tree.links]
bpy.ops.file.pack_all()
assert signature()==geometry
assert im.packed_file
assert graph_before==[(l.from_node.bl_idname,l.from_socket.name,l.to_node.bl_idname,l.to_socket.name)
                       for l in mat.node_tree.links]
bpy.ops.wm.save_as_mainfile(filepath=str(res/'m00-05-zaleznosci-spakowane.blend'))
test=root/'Documentation'/'packing-relocation'
test.mkdir(parents=True,exist_ok=True)
shutil.copyfile(res/'m00-05-zaleznosci-spakowane.blend',test/'projekt.blend')
assert not (test/'etykieta-kurs.png').exists()
bpy.ops.wm.open_mainfile(filepath=str(test/'projekt.blend'),load_ui=False,use_scripts=False)
node=next(n for n in bpy.data.objects['Blat'].data.materials[0].node_tree.nodes if n.type=='TEX_IMAGE')
pixel=list(node.image.pixels[:4])
assert node.image.packed_file and node.image.has_data and tuple(node.image.size)==(256,256)
assert signature()==geometry
(root/'Documentation'/'packing-proof.json').write_text(json.dumps({
 'blender':bpy.app.version_string,'geometry_unchanged':True,'material_graph_unchanged':True,
 'reopened_without_external_image':True,'image_size':list(node.image.size),
 'mesh_objects':len([o for o in bpy.context.scene.objects if o.type=='MESH']),
 'geometry_signature':geometry,'first_pixel':pixel},indent=2),encoding='utf-8')
