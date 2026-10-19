#!/usr/bin/env python3
"""Bounded original-photo compositor for use/occasion/family product stories.

Create: source-preserving-stories-v2.py CONFIG
Read-only pixel replay: source-preserving-stories-v2.py --verify CONFIG RECEIPT CANDIDATE
All inputs/approvals are pinned. Original v1 remains byte-for-byte unchanged.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import sys

import numpy as np
from PIL import Image, ImageChops, ImageFilter

sys.dont_write_bytecode = True
SCHEMA = "source-preserving-stories/v2"
RECEIPT_SCHEMA = "source-preserving-stories-receipt/v2"
APPROVAL_SCHEMA = "source-preserving-stories-approval/v2"
METHOD = "deterministic-original-photo-homography-v2"
V1_SHA = "a93724364d50bbf3ff8eb37466e2cb2540a417002f08bfb3dd65d0791a7506da"
PHOTO_NAME = re.compile(r"^(source(?:-original)?\.(png|webp|jpe?g)|api-reference\.(png|webp|jpe?g)|source-detail-.+\.(png|webp|jpe?g))$", re.I)


def require(value, message):
    if not value:
        raise ValueError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def file_hash(path):
    return digest(Path(path).read_bytes())


def read_json(path):
    data = Path(path).read_bytes()
    return json.loads(data.decode("utf-8-sig")), digest(data)


def resolved(value, root):
    require(isinstance(value, str) and bool(value.strip()), "Nonempty path required")
    p = Path(value)
    return (p if p.is_absolute() else root / p).resolve()


def inside(root, path):
    return path != root and root in path.parents


def sha(value):
    require(isinstance(value, str) and re.fullmatch(r"[0-9a-f]{64}", value), "Lowercase SHA-256 required")
    return value


def date_valid(value):
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).tzinfo is not None
    except (ValueError, AttributeError, TypeError):
        return False


def canonical_sku(value):
    require(isinstance(value, str) and re.fullmatch(r"[0-9]+", value), "Exact digit-string SKU required")
    return value


def renderer():
    path = Path(__file__).resolve().with_name("source-preserving-composite.py")
    require(file_hash(path) == V1_SHA, "Pinned v1 renderer changed")
    spec = importlib.util.spec_from_file_location("pinned_v1_geometry", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module, {"path":str(path), "sha256":V1_SHA}


def prepare(config_path):
    config_path = Path(config_path).resolve()
    cfg, config_hash = read_json(config_path)
    require(cfg.get("schema_version") == SCHEMA, "Unsupported story config schema")
    required = {"schema_version", "sku", "role", "approval", "imagegen_base", "sources", "review", "patches", "output_path", "receipt_path"}
    require(required <= set(cfg) and set(cfg) <= required | {"preserve_base_alpha"}, "Unknown or missing story config fields")
    sku = canonical_sku(cfg["sku"])
    require(cfg["role"] in ("product", "use", "occasion", "family"), "Story role must be product, use, occasion or family")
    roots = [p for p in config_path.parents if p.name == sku and p.parent.name == "skus"]
    require(len(roots) == 1, "Config must be inside job/skus/<hero>")
    sku_root, job_root = roots[0], roots[0].parent.parent
    approval_path = resolved(cfg["approval"]["path"], config_path.parent)
    require(inside(job_root, approval_path), "Approval must be inside this story job")
    approval, approval_hash = read_json(approval_path)
    require(approval_hash == sha(cfg["approval"]["sha256"]), "Immutable approval hash mismatch")
    require(approval.get("schema_version") == APPROVAL_SCHEMA and approval.get("approved") is True and approval.get("approvedBy") == "user" and date_valid(approval.get("approvedAt")) and approval.get("method") == METHOD, "Explicit user story approval required")
    require(sku in approval["skus"] and approval["owners"].get(sku) == f"/root/sku_{sku}", "Hero is not approved with its original owner")
    toolkit_path = Path(__file__).resolve()
    toolkit_record = {"path":str(toolkit_path), "sha256":file_hash(toolkit_path)}
    require(Path(approval["toolkit"]["path"]).is_absolute() and Path(approval["toolkit"]["path"]).resolve() == toolkit_path and approval["toolkit"]["sha256"] == toolkit_record["sha256"], "Story toolkit pin mismatch")
    geometry, renderer_record = renderer()
    require(Path(approval["renderer"]["path"]).resolve() == Path(renderer_record["path"]) and approval["renderer"]["sha256"] == V1_SHA, "Approval must pin the unchanged v1 renderer")
    plan_path = Path(approval["creativePlan"]["path"]).resolve()
    require(Path(approval["creativePlan"]["path"]).is_absolute(), "Creative plan requires absolute path")
    plan, plan_hash = read_json(plan_path)
    require(plan_hash == sha(approval["creativePlan"]["sha256"]) and plan.get("schema_version") == "tuscanini-catalog-creative-reset/v1", "Creative plan pin/schema mismatch")
    assignments = [a for a in plan["skuAssignments"] if a["sku"] == sku]
    require(len(assignments) == 1, "Hero assignment missing or duplicated")
    companions = assignments[0]["companionSkus"]
    require(isinstance(companions, list) and len(companions) == 2 and len(set(companions)) == 2 and sku not in companions, "Exactly two distinct assigned companions required")
    for member in [sku, *companions]:
        canonical_sku(member)
        require(member in plan["sourceCatalog"], "Family member is outside pinned source catalog")
    allowed = {sku, *companions} if cfg["role"] == "family" else {sku}
    review = cfg["review"]
    require(review.get("source_and_base_viewed") is True and review.get("reviewer") == f"/root/sku_{sku}" and date_valid(review.get("viewed_at")), "Source/base review must be by original hero owner with timestamp")
    out = resolved(cfg["output_path"], config_path.parent)
    receipt_path = resolved(cfg["receipt_path"], config_path.parent)
    require(inside(sku_root, out) and inside(sku_root, receipt_path), "Candidate and receipt must remain inside hero SKU folder")
    require(out.suffix.lower() == ".png" and receipt_path.suffix.lower() == ".json", "Candidate must be PNG and receipt JSON")
    base_path = resolved(cfg["imagegen_base"]["path"], config_path.parent)
    base, base_record = geometry.read_image(base_path, sha(cfg["imagegen_base"]["sha256"]))
    source_map, source_records = {}, []
    require(isinstance(cfg["sources"], list) and len(cfg["sources"]) > 0, "Reviewed patch sources required")
    for source in cfg["sources"]:
        require(set(source) == {"source_sku", "path", "sha256", "scope", "status", "reviewer", "notes"}, "Unknown or missing reviewed source field")
        source_sku = canonical_sku(source["source_sku"])
        require(source_sku in allowed, "Source SKU not allowed for this hero/role")
        path = resolved(source["path"], config_path.parent)
        require(path not in source_map, "Duplicate/aliased source path")
        require(source["scope"] in ("exact-package", "qualified-component") and source["status"] in ("matched", "matched-components") and source["reviewer"] == review["reviewer"] and isinstance(source["notes"], str) and source["notes"].strip(), "Source needs hero-owner identity/component review")
        records = approval["sourceCatalog"].get(source_sku, [])
        matches = [r for r in records if Path(r["path"]).is_absolute() and Path(r["path"]).resolve() == path and r["sha256"] == source["sha256"] and r["scope"] == source["scope"] and r["status"] == source["status"]]
        require(len(matches) == 1, "Source not uniquely pinned/qualified in immutable approval")
        original = matches[0]
        require(approval["owners"].get(source_sku) == f"/root/sku_{source_sku}" and original["reviewer"] == f"/root/sku_{source_sku}" and isinstance(original["notes"], str) and original["notes"].strip(), "Original source-SKU qualification missing")
        own_root = Path(approval["sourceRoots"][source_sku]).resolve()
        require(Path(approval["sourceRoots"][source_sku]).is_absolute() and own_root.name == source_sku and own_root.parent.name == "skus", "Source root is not its own SKU folder")
        own_photo = inside(own_root, path) and bool(PHOTO_NAME.fullmatch(path.name))
        component = approval.get("componentRoots", {}).get(source_sku)
        component_root = Path(component).resolve() if component else None
        own_component = bool(component_root and Path(component).is_absolute() and component_root.name == source_sku and inside(component_root, path))
        require((source["scope"] == "exact-package" and own_photo) or (source["scope"] == "qualified-component" and (own_photo or own_component)), "Source path violates own-SKU qualification boundary")
        pixels, asset = geometry.read_image(path, sha(source["sha256"]))
        record = {**asset, "source_sku":source_sku, "scope":source["scope"], "status":source["status"], "reviewer":source["reviewer"], "notes":source["notes"]}
        source_map[path] = (pixels, record)
        source_records.append(record)
    protected = [config_path, approval_path, plan_path, toolkit_path, Path(renderer_record["path"]), base_path, *source_map]
    require(len(set(protected)) == len(protected), "Protected input aliases are forbidden")
    require(out not in protected and receipt_path not in protected and out != receipt_path, "Candidate/receipt aliases protected input")
    require(isinstance(cfg["patches"], list) and len(cfg["patches"]) > 0, "Nonempty patches required")
    preserve_alpha = cfg.get("preserve_base_alpha", True)
    require(isinstance(preserve_alpha, bool), "preserve_base_alpha must be boolean")
    original_alpha = base.getchannel("A")
    ids, consumed, patch_records = set(), set(), []
    for patch in cfg["patches"]:
        required_patch = {"id", "source_sku", "source_path", "source_sha256", "source_quad", "target_quad"}
        require(required_patch <= set(patch) and set(patch) <= required_patch | {"source_polygon", "feather_px", "opacity", "color_match"}, "Unknown or missing patch field")
        patch_id = patch["id"]
        require(isinstance(patch_id, str) and patch_id.strip() and patch_id not in ids, "Unique nonempty patch id required")
        ids.add(patch_id)
        path = resolved(patch["source_path"], config_path.parent)
        require(path in source_map, "Patch source is not a declared reviewed input")
        source, record = source_map[path]
        require(patch["source_sku"] == record["source_sku"] and patch["source_sha256"] == record["sha256"], "Patch source SKU/hash differs from reviewed source")
        consumed.add(path)
        src = geometry.points(patch["source_quad"], source.size, f"{patch_id} source_quad", quad=True)
        dst = geometry.points(patch["target_quad"], base.size, f"{patch_id} target_quad", quad=True)
        polygon = geometry.points(patch.get("source_polygon", patch["source_quad"]), source.size, f"{patch_id} source_polygon")
        mask = ImageChops.multiply(geometry.polygon_mask(source.size, polygon), geometry.polygon_mask(source.size, src))
        coeff = geometry.inverse_homography(src, dst)
        rgb, alpha = geometry.warp_rgba(source, mask, base.size, coeff)
        target_mask = geometry.polygon_mask(base.size, dst)
        feather = geometry.numeric(patch.get("feather_px", 0), 0, 12, "feather_px")
        if feather:
            radius = max(1, int(np.ceil(feather)))
            target_mask = ImageChops.multiply(target_mask, target_mask.filter(ImageFilter.MinFilter(radius*2+1)).filter(ImageFilter.GaussianBlur(feather/2)))
        opacity = geometry.numeric(patch.get("opacity", 1), 0.01, 1, "opacity")
        alpha *= np.asarray(target_mask, dtype=np.float32) / 255 * opacity
        require(np.count_nonzero(alpha > 0.001) > 0, f"{patch_id}: empty transformed patch")
        match = patch.get("color_match", {"mode":"none"})
        require(set(match) <= {"mode", "max_gain_delta"} and match.get("mode", "none") in ("none", "mean_rgb_gain"), "Unsupported color adjustment")
        mode, gains, limit = match.get("mode", "none"), np.ones(3), 0
        if mode == "mean_rgb_gain":
            limit = geometry.numeric(match.get("max_gain_delta",0.12),0,0.15,"max_gain_delta")
            sample = alpha > 0.5
            require(sample.sum() >= 16, "Color matching needs 16 opaque patch pixels")
            base_rgb = np.asarray(base,dtype=np.float32)[:,:,:3]/255
            gains = np.clip(base_rgb[sample].mean(axis=0,dtype=np.float64)/np.maximum(rgb[sample].mean(axis=0,dtype=np.float64),0.01),1-limit,1+limit)
            rgb = np.clip(rgb*gains,0,1)
        overlay = Image.fromarray(np.dstack([np.rint(rgb*255),np.rint(alpha*255)]).astype(np.uint8))
        base = Image.alpha_composite(base, overlay)
        if preserve_alpha:
            base.putalpha(original_alpha)
        patch_records.append({"id":patch_id,"source_sku":record["source_sku"],"source_path":str(path),"source_sha256":record["sha256"],"source_quad":src.tolist(),"source_polygon":polygon.tolist(),"target_quad":dst.tolist(),"inverse_homography":coeff.tolist(),"opacity":opacity,"feather_px":feather,"color_match":{"mode":mode,"rgb_gain":gains.tolist(),"max_gain_delta":limit},"affected_pixels":int(np.count_nonzero(alpha>0)),"resampling":"Pillow bicubic premultiplied RGBA"})
    require(consumed == set(source_map), "Declared sources must exactly equal consumed patch inputs")
    invariants = {"schema_version":RECEIPT_SCHEMA,"method":METHOD,"sku":sku,"role":cfg["role"],"config":{"path":str(config_path),"sha256":config_hash},"approval":{"path":str(approval_path),"sha256":approval_hash},"creativePlan":{"path":str(plan_path),"sha256":plan_hash},"toolkit":toolkit_record,"renderer":renderer_record,"assignment":{"heroSku":sku,"companionSkus":companions},"base":base_record,"sources":source_records,"patches":patch_records,"review":review,"preserve_base_alpha":preserve_alpha,"decoded_rgba_sha256":digest(base.tobytes()),"identity_verified":False,"software":{"Pillow":Image.__version__,"numpy":np.__version__}}
    tracked = {p:file_hash(p) for p in protected}
    require(tracked[config_path] == config_hash and tracked[approval_path] == approval_hash and tracked[plan_path] == plan_hash and tracked[base_path] == base_record["sha256"], "Input changed during rendering")
    require(tracked[toolkit_path] == toolkit_record["sha256"] and tracked[Path(renderer_record["path"])] == V1_SHA, "Toolkit changed during rendering")
    require(all(tracked[Path(s["path"])] == s["sha256"] for s in source_records), "Source changed during rendering")
    return base, invariants, out, receipt_path, tracked


def recheck(tracked):
    for path, expected in tracked.items():
        require(file_hash(path) == expected, f"Input changed during operation: {path}")


def create(config_path):
    image, invariants, out, receipt_path, tracked = prepare(config_path)
    require(not out.exists() and not receipt_path.exists(), "Candidate and receipt must be new files")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    png = buffer.getvalue()
    receipt = {**invariants,"created_at":datetime.now(timezone.utc).isoformat(),"final":{"path":str(out),"sha256":digest(png),"dimensions":{"width":image.width,"height":image.height}},"review_requirement":"Hero owner must inspect entire final and every visible hero/companion label against each approved source; coordinates and pixel replay do not prove identity."}
    recheck(tracked)
    out.parent.mkdir(parents=True,exist_ok=True)
    receipt_path.parent.mkdir(parents=True,exist_ok=True)
    with out.open("xb") as handle:
        handle.write(png)
    try:
        with receipt_path.open("x",encoding="utf-8",newline="\n") as handle:
            json.dump(receipt,handle,indent=2,allow_nan=False)
            handle.write("\n")
    except Exception as exc:
        raise RuntimeError(f"Candidate exists at {out}; receipt failed. Do not accept without receipt") from exc
    return {"final":receipt["final"],"receipt_path":str(receipt_path),"identity_verified":False}


def verify(config_path,receipt_path,candidate_path):
    expected,invariants,out,configured_receipt,tracked = prepare(config_path)
    receipt_path,candidate_path = Path(receipt_path).resolve(),Path(candidate_path).resolve()
    require(receipt_path == configured_receipt and candidate_path == out,"Verification paths disagree with config")
    receipt,receipt_hash = read_json(receipt_path)
    for key,value in invariants.items():
        require(receipt.get(key) == value,f"Story receipt invariant mismatch: {key}")
    data = candidate_path.read_bytes()
    final_hash = digest(data)
    require(receipt.get("final") == {"path":str(out),"sha256":final_hash,"dimensions":{"width":expected.width,"height":expected.height}},"Final path/hash/dimensions mismatch")
    with Image.open(io.BytesIO(data)) as actual:
        require(actual.format == "PNG" and actual.mode == "RGBA" and actual.size == expected.size and actual.tobytes() == expected.tobytes(),"Final decoded pixels differ from deterministic replay")
    recheck({**tracked,receipt_path:receipt_hash,candidate_path:final_hash})
    return {"verified":True,"sku":invariants["sku"],"role":invariants["role"],"final_sha256":final_hash,"decoded_rgba_sha256":invariants["decoded_rgba_sha256"],"writes":0}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify",action="store_true")
    parser.add_argument("paths",nargs="+")
    args=parser.parse_args()
    if len(args.paths) != (3 if args.verify else 1):
        parser.error("Use CONFIG, or --verify CONFIG RECEIPT CANDIDATE")
    try:
        result=verify(*args.paths) if args.verify else create(args.paths[0])
    except (ValueError,KeyError,TypeError,OSError,RuntimeError) as exc:
        parser.exit(1,f"Story composite refused: {exc}\n")
    print(json.dumps(result,indent=2,allow_nan=False))


if __name__ == "__main__":
    main()
