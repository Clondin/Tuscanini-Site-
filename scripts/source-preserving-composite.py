#!/usr/bin/env python3
"""Deterministic, auditable original-photo pixels over an ImageGen base.

Usage: python source-preserving-composite.py CONFIG.json
Coordinates refer to EXIF-oriented images, with (0,0) at upper left.
No image generation, text rendering, automatic identity approval or source writes.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import math
import os
from pathlib import Path
from datetime import datetime, timezone

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

CONFIG_VERSION = "source-preserving-composite/v1"
RECEIPT_VERSION = "source-preserving-composite-receipt/v1"
METHOD = "deterministic-original-photo-homography"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def dimensions(image):
    return {"width": image.width, "height": image.height}


def resolve(value, root):
    require(isinstance(value, str) and bool(value.strip()), "Path must be a nonempty string")
    path = Path(value).expanduser()
    return (path if path.is_absolute() else root / path).resolve()


def read_image(path, expected_hash=None):
    digest = sha256(path)
    if expected_hash is not None:
        require(digest == expected_hash, f"Source hash mismatch: {path}")
    with Image.open(path) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGBA")
    require(image.width > 0 and image.height > 0, f"Empty image: {path}")
    return image, {"path": str(path), "sha256": digest, "dimensions": dimensions(image)}


def points(value, size, name, quad=False):
    arr = np.asarray(value, dtype=np.float64)
    require(arr.ndim == 2 and arr.shape[1] == 2 and len(arr) >= 3, f"{name}: need x,y polygon points")
    require(not quad or len(arr) == 4, f"{name}: need exactly four ordered corners")
    require(np.isfinite(arr).all(), f"{name}: coordinates must be finite")
    require(((arr[:, 0] >= 0) & (arr[:, 0] <= size[0]) & (arr[:, 1] >= 0) & (arr[:, 1] <= size[1])).all(), f"{name}: coordinates outside image bounds")
    area = abs(np.dot(arr[:, 0], np.roll(arr[:, 1], 1)) - np.dot(arr[:, 1], np.roll(arr[:, 0], 1))) / 2
    require(area >= 4, f"{name}: polygon has less than four pixels of area")
    if quad:
        edges = np.roll(arr, -1, axis=0) - arr
        cross = edges[:, 0] * np.roll(edges[:, 1], -1) - edges[:, 1] * np.roll(edges[:, 0], -1)
        require((cross > 1e-7).all() or (cross < -1e-7).all(), f"{name}: quad must be convex, ordered, and nondegenerate")
    else:
        # Reject self-intersecting polygon masks; adjacent edges share an endpoint.
        def orient(a, b, c):
            return (b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0])
        for i in range(len(arr)):
            for j in range(i+1, len(arr)):
                if j == i+1 or (i == 0 and j == len(arr)-1):
                    continue
                a,b,c,d = arr[i],arr[(i+1)%len(arr)],arr[j],arr[(j+1)%len(arr)]
                require(not (orient(a,b,c)*orient(a,b,d) < 0 and orient(c,d,a)*orient(c,d,b) < 0), f"{name}: polygon self-intersects")
    return arr


def inverse_homography(source, target):
    """Pillow wants output (target) -> input (source) mapping."""
    rows, values = [], []
    for (x, y), (u, v) in zip(target, source):
        rows.extend([[x,y,1,0,0,0,-u*x,-u*y], [0,0,0,x,y,1,-v*x,-v*y]])
        values.extend([u,v])
    try:
        coeff = np.linalg.solve(np.asarray(rows), np.asarray(values))
    except np.linalg.LinAlgError as exc:
        raise ValueError("Cannot solve degenerate homography") from exc
    require(np.isfinite(coeff).all(), "Homography contains nonfinite values")
    denominators = target @ coeff[6:8] + 1
    require((denominators > 1e-8).all() or (denominators < -1e-8).all(), "Homography crosses infinity within target")
    return coeff


def polygon_mask(size, polygon):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon([tuple(p) for p in polygon], fill=255)
    return mask


def warp_rgba(source, mask, target_size, coeff):
    """Resample premultiplied color to avoid dark/white transparent-edge halos."""
    rgba = np.asarray(source, dtype=np.float32) / 255
    alpha = rgba[:, :, 3] * np.asarray(mask, dtype=np.float32) / 255
    planes = [rgba[:, :, channel] * alpha for channel in range(3)] + [alpha]
    warped = []
    for plane in planes:
        warped.append(np.asarray(Image.fromarray(plane).transform(target_size, Image.Transform.PERSPECTIVE, coeff.tolist(), Image.Resampling.BICUBIC, fillcolor=0), dtype=np.float32))
    alpha = np.clip(warped[3], 0, 1)
    rgb = np.stack(warped[:3], axis=2) / np.maximum(alpha[:, :, None], 1e-8)
    return np.clip(rgb, 0, 1), alpha


def numeric(value, low, high, name):
    require(isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and low <= value <= high, f"{name} must be between {low} and {high}")
    return float(value)


def composite(config_path):
    config_path = Path(config_path).resolve()
    config_bytes = config_path.read_bytes()
    cfg = json.loads(config_bytes)
    require(cfg.get("schema_version") == CONFIG_VERSION, "Unsupported config schema_version")
    require(isinstance(cfg.get("sku"), str) and bool(cfg["sku"].strip()), "sku must be a nonempty exact string")
    review = cfg.get("review", {})
    require(review.get("source_and_base_viewed") is True and bool(review.get("reviewer")) and bool(review.get("viewed_at")), "Owner must view source and base, then record reviewer and viewed_at")
    require(isinstance(cfg.get("patches"), list) and len(cfg["patches"]) > 0, "Need at least one patch")
    root = config_path.parent
    base_spec = cfg["imagegen_base"]
    base_path = resolve(base_spec["path"], root)
    out = resolve(cfg["output_path"], root)
    receipt_path = resolve(cfg["receipt_path"], root)
    toolkit_path = Path(__file__).resolve()
    source_paths = [resolve(p["source_path"], root) for p in cfg["patches"]]
    protected = {config_path, base_path, toolkit_path, *source_paths}
    require(out not in protected and receipt_path not in protected and out != receipt_path, "Output/receipt cannot overwrite any input or each other")
    require(out.suffix.lower() == ".png", "Output must be lossless .png")
    require(receipt_path.suffix.lower() == ".json", "Receipt must be .json")
    require(not out.exists() and not receipt_path.exists(), "Output and receipt must be new files; choose explicit new paths")
    preserve_alpha = cfg.get("preserve_base_alpha", True)
    require(isinstance(preserve_alpha, bool), "preserve_base_alpha must be boolean")
    base, base_record = read_image(base_path, base_spec.get("sha256"))
    original_alpha = base.getchannel("A")
    source_records, patch_records, ids = {}, [], set()
    for patch, source_path in zip(cfg["patches"], source_paths):
        patch_id = patch.get("id")
        require(isinstance(patch_id, str) and patch_id.strip() and patch_id not in ids, "Patch ids must be unique nonempty strings")
        ids.add(patch_id)
        source, source_record = read_image(source_path, patch.get("source_sha256"))
        source_records[str(source_path)] = source_record
        src_quad = points(patch["source_quad"], source.size, f"{patch_id} source_quad", quad=True)
        dst_quad = points(patch["target_quad"], base.size, f"{patch_id} target_quad", quad=True)
        polygon = points(patch.get("source_polygon", patch["source_quad"]), source.size, f"{patch_id} source_polygon")
        source_mask = ImageChops.multiply(polygon_mask(source.size, polygon), polygon_mask(source.size, src_quad))
        coeff = inverse_homography(src_quad, dst_quad)
        rgb, alpha = warp_rgba(source, source_mask, base.size, coeff)
        # Restrict exact target region; soften inward only, preserving outside pixels.
        target_mask = polygon_mask(base.size, dst_quad)
        feather = numeric(patch.get("feather_px", 0), 0, 12, "feather_px")
        if feather:
            radius = max(1, math.ceil(feather))
            eroded = target_mask.filter(ImageFilter.MinFilter(radius * 2 + 1))
            target_mask = ImageChops.multiply(target_mask, eroded.filter(ImageFilter.GaussianBlur(feather / 2)))
        opacity = numeric(patch.get("opacity", 1), 0.01, 1, "opacity")
        alpha *= np.asarray(target_mask, dtype=np.float32) / 255 * opacity
        require(int(np.count_nonzero(alpha > 0.001)) > 0, f"{patch_id}: empty transformed patch")
        match = patch.get("color_match", {"mode": "none"})
        mode = match.get("mode", "none")
        require(mode in ("none", "mean_rgb_gain"), "Unsupported color_match mode")
        gains = np.ones(3)
        if mode == "mean_rgb_gain":
            limit = numeric(match.get("max_gain_delta", 0.12), 0, 0.15, "max_gain_delta")
            sample = alpha > 0.5
            require(int(sample.sum()) >= 16, "Color matching needs 16 opaque patch pixels")
            base_rgb = np.asarray(base, dtype=np.float32)[:, :, :3] / 255
            gains = np.clip(base_rgb[sample].mean(axis=0, dtype=np.float64) / np.maximum(rgb[sample].mean(axis=0, dtype=np.float64), 0.01), 1-limit, 1+limit)
            rgb = np.clip(rgb * gains, 0, 1)
        overlay = Image.fromarray(np.dstack([np.rint(rgb * 255), np.rint(alpha * 255)]).astype(np.uint8))
        base = Image.alpha_composite(base, overlay)
        if preserve_alpha:
            base.putalpha(original_alpha)
        patch_records.append({"id":patch_id, "source_path":str(source_path), "source_sha256":source_record["sha256"], "source_quad":src_quad.tolist(), "source_polygon":polygon.tolist(), "target_quad":dst_quad.tolist(), "inverse_homography":coeff.tolist(), "resampling":"Pillow bicubic premultiplied RGBA", "feather_px":feather, "feather_method":"inward erosion then Gaussian blur clipped to target quad", "opacity":opacity, "color_match":{"mode":mode, "rgb_gain":gains.tolist(), "max_gain_delta":match.get("max_gain_delta",0.12) if mode != "none" else 0}, "affected_pixels":int(np.count_nonzero(alpha > 0)), "effective_alpha_max":float(alpha.max())})
    buffer = io.BytesIO()
    base.save(buffer, format="PNG")
    final_bytes = buffer.getvalue()
    receipt = {"schema_version":RECEIPT_VERSION, "sku":cfg["sku"], "created_at":datetime.now(timezone.utc).isoformat(), "method":METHOD, "config":{"path":str(config_path), "sha256":hashlib.sha256(config_bytes).hexdigest()}, "toolkit":{"path":str(toolkit_path), "sha256":sha256(toolkit_path)}, "base":base_record, "sources":list(source_records.values()), "patches":patch_records, "preserve_base_alpha":preserve_alpha, "final":{"path":str(out), "sha256":hashlib.sha256(final_bytes).hexdigest(), "dimensions":dimensions(base)}, "review":review, "identity_verified":False, "review_requirement":"Owner must visually inspect final whole image and close-ups against original source before acceptance.", "software":{"Pillow":Image.__version__, "numpy":np.__version__}, "safety":{"input_files_unchanged":True, "output_new_file":True, "coordinates_in_bounds":True, "quads_convex_nonempty":True, "patches_nonempty":True}}
    # Refuse a changed input, including a source changed while processing.
    for record in [base_record, *source_records.values()]:
        require(sha256(record["path"]) == record["sha256"], f"Input changed during composite: {record['path']}")
    require(sha256(config_path) == receipt["config"]["sha256"], "Config changed during composite")
    out.parent.mkdir(parents=True, exist_ok=True)
    receipt_path.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation protects originals, including a race with another owner.
    with out.open("xb") as handle:
        handle.write(final_bytes)
    try:
        with receipt_path.open("x", encoding="utf-8", newline="\n") as handle:
            json.dump(receipt, handle, indent=2, allow_nan=False)
            handle.write("\n")
    except Exception:
        # Keep new final for inspection; never remove a file another owner created.
        raise RuntimeError(f"Final saved at {out}, but receipt write failed; do not accept without receipt")
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("config", type=Path)
    args = parser.parse_args()
    try:
        result = composite(args.config)
    except (ValueError, KeyError, OSError, TypeError) as exc:
        parser.exit(1, f"Composite refused: {exc}\n")
    print(json.dumps({"final":result["final"], "receipt_path":str(resolve(json.loads(args.config.read_text(encoding="utf-8"))["receipt_path"], args.config.resolve().parent)), "identity_verified":False}, indent=2))


if __name__ == "__main__":
    main()
