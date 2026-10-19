"""Read-only inspection of course sources. Run with Blender --disable-autoexec."""
import bpy
import bmesh
import hashlib
import json
import traceback
from pathlib import Path
from mathutils import Vector

ROOT = Path('C:/xampp/htdocs/blender-course-development/inspection')
SOURCE = Path('C:/Users/rudek/Desktop/blender come back/KURS')
ROOT.mkdir(parents=True, exist_ok=True)


def vec(v):
    return [round(float(x), 6) for x in v]


def inspect(path):
    before = hashlib.sha256(path.read_bytes()).hexdigest()
    bpy.ops.wm.open_mainfile(filepath=str(path), load_ui=False, use_scripts=False)
    saved_mode = bpy.context.mode
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    scene = bpy.context.scene
    dg = bpy.context.evaluated_depsgraph_get()
    result = {
        'source': str(path), 'sha256_before': before,
        'blender': bpy.app.version_string,
        'saved_context_mode': saved_mode,
        'units': {'system': scene.unit_settings.system,
                  'scale_length': scene.unit_settings.scale_length,
                  'length_unit': scene.unit_settings.length_unit},
        'objects': [], 'images': [], 'materials': [],
    }
    for ob in scene.objects:
        entry = {
            'name': ob.name, 'type': ob.type,
            'parent': ob.parent.name if ob.parent else None,
            'collections': [c.name for c in ob.users_collection],
            'location': vec(ob.location), 'rotation_euler': vec(ob.rotation_euler),
            'scale': vec(ob.scale), 'dimensions_scene_units': vec(ob.dimensions),
            'dimensions_m': vec(ob.dimensions * scene.unit_settings.scale_length),
            'hidden_viewport': ob.hide_get(), 'hidden_render': ob.hide_render,
            'modifiers': [],
        }
        for mod in ob.modifiers:
            m = {'name': mod.name, 'type': mod.type,
                 'viewport': mod.show_viewport, 'render': mod.show_render}
            for key in ('levels', 'render_levels', 'thickness', 'offset', 'width',
                        'segments', 'count', 'merge_threshold', 'use_clip',
                        'use_mirror_merge', 'keep_sharp', 'weight', 'use_axis'):
                if hasattr(mod, key):
                    value = getattr(mod, key)
                    m[key] = list(value) if key == 'use_axis' else value
            if hasattr(mod, 'mirror_object'):
                m['mirror_object'] = mod.mirror_object.name if mod.mirror_object else None
            entry['modifiers'].append(m)
        if ob.type == 'MESH':
            mesh = ob.data
            mesh.calc_loop_triangles()
            bm = bmesh.new()
            bm.from_mesh(mesh)
            entry['mesh'] = {
                'data_name': mesh.name, 'data_users': mesh.users,
                'vertices': len(mesh.vertices), 'edges': len(mesh.edges),
                'faces': len(mesh.polygons), 'triangles': len(mesh.loop_triangles),
                'quads': sum(len(p.vertices) == 4 for p in mesh.polygons),
                'ngons': sum(len(p.vertices) > 4 for p in mesh.polygons),
                'smooth_faces': sum(p.use_smooth for p in mesh.polygons),
                'boundary_edges': sum(e.is_boundary for e in bm.edges),
                'wire_edges': sum(e.is_wire for e in bm.edges),
                'edges_over_two_faces': sum(len(e.link_faces) > 2 for e in bm.edges),
                'loose_vertices': sum(not v.link_edges for v in bm.verts),
                'zero_area_faces': sum(f.calc_area() < 1e-12 for f in bm.faces),
                'uv_layers': [],
                'materials': [s.material.name if s.material else None for s in ob.material_slots],
            }
            bm.free()
            for uv in mesh.uv_layers:
                points = [tuple(x.vector) for x in uv.uv]
                entry['mesh']['uv_layers'].append({
                    'name': uv.name, 'active_render': uv.active_render,
                    'bounds': [vec((min(p[i] for p in points), max(p[i] for p in points)))
                               for i in range(2)] if points else None,
                    'zero_area_uv_faces': sum(
                        abs(sum(points[p.loop_start + i][0] * points[p.loop_start + (i+1) % p.loop_total][1]
                                - points[p.loop_start + (i+1) % p.loop_total][0] * points[p.loop_start + i][1]
                                for i in range(p.loop_total))) < 1e-12
                        for p in mesh.polygons) if points else len(mesh.polygons),
                })
            ev = ob.evaluated_get(dg)
            em = ev.to_mesh()
            try:
                em.calc_loop_triangles()
                entry['evaluated_viewport'] = {
                    'vertices': len(em.vertices), 'faces': len(em.polygons),
                    'triangles': len(em.loop_triangles),
                }
                ebm = bmesh.new()
                ebm.from_mesh(em)
                entry['evaluated_viewport']['boundary_edges'] = sum(e.is_boundary for e in ebm.edges)
                entry['evaluated_viewport']['edges_over_two_faces'] = sum(len(e.link_faces) > 2 for e in ebm.edges)
                entry['evaluated_viewport']['inconsistent_winding_edges'] = sum(
                    e.is_manifold and not e.is_contiguous for e in ebm.edges)
                entry['evaluated_viewport']['over_two_faces_examples'] = [
                    {'center_local': vec((e.verts[0].co + e.verts[1].co) / 2),
                     'incident_faces': len(e.link_faces)}
                    for e in ebm.edges if len(e.link_faces) > 2][:20]
                ebm.free()
            finally:
                ev.to_mesh_clear()
        result['objects'].append(entry)
    for img in bpy.data.images:
        if img.source in {'VIEWER'}:
            continue
        resolved = bpy.path.abspath(img.filepath, library=img.library) if img.filepath else ''
        result['images'].append({
            'name': img.name, 'source': img.source, 'filepath': img.filepath,
            'resolved': resolved, 'size': list(img.size),
            'packed': bool(img.packed_file),
            'external_exists': Path(resolved).is_file() if resolved and img.source != 'TILED' else None,
            'colorspace': img.colorspace_settings.name,
            'tiles': [{'number': tile.number, 'label': tile.label,
                       'resolved': resolved.replace('<UDIM>', str(tile.number)),
                       'exists': Path(resolved.replace('<UDIM>', str(tile.number))).is_file()
                       if resolved else None} for tile in img.tiles],
        })
    for mat in bpy.data.materials:
        entry = {'name': mat.name, 'users': mat.users, 'nodes': []}
        if mat.use_nodes and mat.node_tree:
            for node in mat.node_tree.nodes:
                nd = {'type': node.bl_idname, 'name': node.name}
                if node.type == 'BSDF_PRINCIPLED':
                    nd['inputs'] = {}
                    for name in ('Base Color', 'Metallic', 'Roughness', 'Alpha',
                                 'Transmission Weight', 'Coat Weight'):
                        socket = node.inputs.get(name)
                        if socket:
                            v = socket.default_value
                            nd['inputs'][name] = {'linked': socket.is_linked,
                                'value': list(v) if hasattr(v, '__len__') else v}
                if node.type == 'TEX_IMAGE':
                    nd['image'] = node.image.name if node.image else None
                entry['nodes'].append(nd)
        result['materials'].append(entry)
    result['sha256_after'] = hashlib.sha256(path.read_bytes()).hexdigest()
    points = [ob.matrix_world @ Vector(c) for ob in scene.objects
              if ob.type == 'MESH' and not ob.hide_get() for c in ob.bound_box]
    if points:
        result['scene_mesh_bounds_m'] = vec(Vector([
            max(p[i] for p in points) - min(p[i] for p in points)
            for i in range(3)]) * scene.unit_settings.scale_length)
    result['source_unchanged'] = before == result['sha256_after']
    (ROOT / (path.stem + '.json')).write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    return result


def preview(result, stem):
    """Workbench geometry previews; no material or final-render validation."""
    scene = bpy.context.scene
    obs = [ob for ob in scene.objects if ob.type == 'MESH' and not ob.hide_get()]
    if not obs:
        return
    pts = [ob.matrix_world @ Vector(corner) for ob in obs for corner in ob.bound_box]
    lo = Vector([min(p[i] for p in pts) for i in range(3)])
    hi = Vector([max(p[i] for p in pts) for i in range(3)])
    center = (lo + hi) / 2
    size = max(hi - lo)
    # Reference images and helper geometry must not obstruct the mesh preview.
    for ob in scene.objects:
        if ob.type != 'MESH':
            ob.hide_render = True
    camera_data = bpy.data.cameras.new('AuditCamera')
    camera = bpy.data.objects.new('AuditCamera', camera_data)
    scene.collection.objects.link(camera)
    scene.camera = camera
    camera.hide_render = False
    camera_data.type = 'ORTHO'
    camera_data.ortho_scale = size * 1.65
    camera_data.clip_end = max(1000, size * 20)
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    shading = scene.display.shading
    shading.light = 'STUDIO'
    shading.color_type = 'SINGLE'
    shading.single_color = (0.48, 0.52, 0.58)
    shading.show_shadows = True
    shading.show_cavity = True
    shading.background_type = 'WORLD'
    scene.world.color = (0.065, 0.065, 0.065)
    for label, direction in [('perspective', (1.4, -1.8, 1.1)),
                             ('opposite', (-1.4, 1.8, 0.8)),
                             ('side', (1, 0, 0.15))]:
        camera.location = center + Vector(direction).normalized() * size * 3
        camera.rotation_euler = (center - camera.location).to_track_quat('-Z', 'Y').to_euler()
        scene.render.filepath = str(ROOT / f'{stem}-{label}.png')
        bpy.ops.render.render(write_still=True)


errors = []
for name in ('stół.blend', 'butelka.blend', 'dodge.blend'):
    try:
        report = inspect(SOURCE / name)
        try:
            preview(report, Path(name).stem)
        except Exception:
            errors.append({'file': name, 'phase': 'preview', 'error': traceback.format_exc()})
    except Exception:
        errors.append({'file': name, 'phase': 'inspection', 'error': traceback.format_exc()})
(ROOT / 'complete.json').write_text(json.dumps({'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
