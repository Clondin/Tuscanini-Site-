#!/usr/bin/env python3
"""Restore original-photo alpha without changing enhanced composite RGB.

Create: source-photo-alpha.py CONFIG
Read-only replay: source-photo-alpha.py --verify CONFIG RECEIPT CANDIDATE
The original composite v1 toolkit and receipts are neither imported nor changed.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

CONFIG_VERSION = "source-photo-alpha/v1"
RECEIPT_VERSION = "source-photo-alpha-receipt/v1"
METHOD = "deterministic-original-photo-alpha-homography"
PARENT_VERSION = "source-preserving-composite-receipt/v1"
PARENT_METHOD = "deterministic-original-photo-homography"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def file_hash(path):
    return digest(Path(path).read_bytes())


def resolve(value, root):
    require(isinstance(value, str) and bool(value.strip()), "Path must be a nonempty string")
    path = Path(value).expanduser()
    return (path if path.is_absolute() else root / path).resolve()


def dimensions(image):
    return {"width": image.width, "height": image.height}


def checked_hash(value, name):
    require(isinstance(value, str) and len(value) == 64 and all(c in "0123456789abcdef" for c in value), f"{name} requires a lowercase SHA-256")
    return value


def read_json_bytes(path):
    data = Path(path).read_bytes()
    return json.loads(data.decode("utf-8-sig")), digest(data)


def read_image(path, expected_hash):
    data = Path(path).read_bytes()
    require(digest(data) == expected_hash, f"Input hash mismatch: {path}")
    with Image.open(io.BytesIO(data)) as raw:
        oriented = ImageOps.exif_transpose(raw)
        image = oriented.convert("RGBA")
    return image, {"path": str(path), "sha256": expected_hash, "dimensions": dimensions(image)}


def quad(value, size, name):
    result = np.asarray(value, dtype=np.float64)
    require(result.shape == (4, 2) and np.isfinite(result).all(), f"{name} needs four finite x,y corners")
    require(((result[:,0] >= 0) & (result[:,0] <= size[0]) & (result[:,1] >= 0) & (result[:,1] <= size[1])).all(), f"{name} outside image bounds")
    edges = np.roll(result, -1, axis=0) - result
    turns = edges[:,0] * np.roll(edges[:,1], -1) - edges[:,1] * np.roll(edges[:,0], -1)
    require((turns > 1e-7).all() or (turns < -1e-7).all(), f"{name} must be convex, ordered and nondegenerate")
    area = abs(np.dot(result[:,0], np.roll(result[:,1], 1)) - np.dot(result[:,1], np.roll(result[:,0], 1))) / 2
    require(area >= 4, f"{name} has less than four pixels of area")
    return result


def inverse_homography(source, target):
    rows, rhs = [], []
    for (x,y),(u,v) in zip(target, source):
        rows.extend([[x,y,1,0,0,0,-u*x,-u*y], [0,0,0,x,y,1,-v*x,-v*y]])
        rhs.extend([u,v])
    try:
        coeff = np.linalg.solve(np.asarray(rows), np.asarray(rhs))
    except np.linalg.LinAlgError as exc:
        raise ValueError("Degenerate alpha homography") from exc
    require(np.isfinite(coeff).all(), "Nonfinite alpha homography")
    denominators = target @ coeff[6:8] + 1
    require((denominators > 1e-8).all() or (denominators < -1e-8).all(), "Alpha homography crosses infinity")
    return coeff


def validate_review(review, sku):
    require(isinstance(review, dict) and review.get("source_and_base_viewed") is True, "Owner must view original alpha source and parent composite")
    require(review.get("reviewer") == f"/root/sku_{sku}", "Review must name the existing canonical SKU owner")
    try:
        viewed = datetime.fromisoformat(review.get("viewed_at", "").replace("Z", "+00:00"))
        require(viewed.tzinfo is not None, "Review timestamp needs a timezone")
    except (ValueError, TypeError, AttributeError) as exc:
        raise ValueError("Review requires a valid viewed_at timestamp with timezone") from exc


def build_expected(config_path):
    """Read immutable inputs and calculate expected decoded RGBA; never write."""
    config_path = Path(config_path).resolve()
    cfg, config_hash = read_json_bytes(config_path)
    require(cfg.get("schema_version") == CONFIG_VERSION, "Unsupported alpha config schema")
    require(set(cfg) == {"schema_version", "sku", "parent", "source", "source_quad", "target_quad", "output_path", "receipt_path", "review"}, "Unknown or missing alpha config field")
    sku = cfg.get("sku")
    require(isinstance(sku, str) and sku.isascii() and sku.isdigit(), "SKU must be an exact digit string")
    validate_review(cfg["review"], sku)
    root = config_path.parent
    parent = cfg["parent"]
    require(set(parent) == {"receipt_path", "receipt_sha256", "candidate_path", "candidate_sha256"}, "Unknown or missing parent field")
    require(set(cfg["source"]) == {"path", "sha256"}, "Unknown or missing alpha source field")
    parent_receipt_path = resolve(parent["receipt_path"], root)
    parent_candidate_path = resolve(parent["candidate_path"], root)
    source_path = resolve(cfg["source"]["path"], root)
    out = resolve(cfg["output_path"], root)
    receipt_path = resolve(cfg["receipt_path"], root)
    toolkit_path = Path(__file__).resolve()
    protected = [config_path, parent_receipt_path, parent_candidate_path, source_path, toolkit_path]
    require(len(set(protected)) == len(protected), "Protected input paths must not alias each other")
    require(out not in protected and receipt_path not in protected and out != receipt_path, "Output/receipt aliases a protected input or each other")
    require(out.suffix.lower() == ".png" and receipt_path.suffix.lower() == ".json", "Output must be PNG and receipt JSON")
    parent_receipt, parent_receipt_hash = read_json_bytes(parent_receipt_path)
    require(parent_receipt_hash == checked_hash(parent["receipt_sha256"], "parent.receipt_sha256"), "Parent receipt hash mismatch")
    require(parent_receipt.get("schema_version") == PARENT_VERSION and parent_receipt.get("method") == PARENT_METHOD and parent_receipt.get("sku") == sku, "Parent must be an existing same-SKU composite v1 receipt")
    parent_final = parent_receipt["final"]
    require(Path(parent_final["path"]).is_absolute() and Path(parent_final["path"]).resolve() == parent_candidate_path, "Parent receipt final differs from candidate path")
    parent_hash = checked_hash(parent["candidate_sha256"], "parent.candidate_sha256")
    require(parent_final["sha256"] == parent_hash, "Parent receipt final differs from candidate hash")
    base, base_record = read_image(parent_candidate_path, parent_hash)
    require(parent_final["dimensions"] == base_record["dimensions"], "Parent receipt candidate dimensions mismatch")
    source, source_record = read_image(source_path, checked_hash(cfg["source"]["sha256"], "source.sha256"))
    source_alpha = source.getchannel("A")
    low, high = source_alpha.getextrema()
    require(low < high and low < 255 and high > 0, "Original source must contain true alpha variation")
    src = quad(cfg["source_quad"], source.size, "source_quad")
    full = np.asarray([[0,0],[source.width,0],[source.width,source.height],[0,source.height]], dtype=np.float64)
    require(np.array_equal(src, full), "source_quad must be the entire original image in canonical corner order")
    dst = quad(cfg["target_quad"], base.size, "target_quad")
    coeff = inverse_homography(src, dst)
    alpha = source_alpha.transform(base.size, Image.Transform.PERSPECTIVE, coeff.tolist(), Image.Resampling.BICUBIC, fillcolor=0)
    # The only mask is the configured full-source target quad. No custom contour.
    bounds = Image.new("L", base.size, 0)
    ImageDraw.Draw(bounds).polygon([tuple(p) for p in dst], fill=255)
    alpha_array = np.asarray(alpha).copy()
    alpha_array[np.asarray(bounds) == 0] = 0
    require(int(alpha_array.max()) > 0 and int(alpha_array.min()) < 255, "Transformed alpha is empty or entirely opaque")
    final = base.copy()
    final.putalpha(Image.fromarray(alpha_array))
    require(final.convert("RGB").tobytes() == base.convert("RGB").tobytes(), "Internal RGB preservation failure")
    parent_record = {"receipt_path":str(parent_receipt_path), "receipt_sha256":parent_receipt_hash, "candidate_path":str(parent_candidate_path), "candidate_sha256":parent_hash}
    invariant = {"schema_version":RECEIPT_VERSION, "method":METHOD, "sku":sku, "config":{"path":str(config_path), "sha256":config_hash}, "toolkit":{"path":str(toolkit_path), "sha256":file_hash(toolkit_path)}, "parent":parent_record, "source":source_record, "source_quad":src.tolist(), "target_quad":dst.tolist(), "inverse_homography":coeff.tolist(), "review":cfg["review"], "decoded_rgb_sha256":digest(final.convert("RGB").tobytes()), "alpha_sha256":digest(alpha_array.tobytes())}
    tracked = {config_path:config_hash, parent_receipt_path:parent_receipt_hash, parent_candidate_path:parent_hash, source_path:source_record["sha256"], toolkit_path:invariant["toolkit"]["sha256"]}
    return final, invariant, out, receipt_path, tracked


def recheck_inputs(tracked):
    for path, expected in tracked.items():
        require(file_hash(path) == expected, f"Input changed during alpha operation: {path}")


def create(config_path):
    expected, invariant, out, receipt_path, tracked = build_expected(config_path)
    require(not out.exists() and not receipt_path.exists(), "Candidate and receipt must be new files")
    buffer = io.BytesIO()
    expected.save(buffer, format="PNG")
    png = buffer.getvalue()
    receipt = {**invariant, "created_at":datetime.now(timezone.utc).isoformat(), "final":{"path":str(out), "sha256":digest(png), "dimensions":dimensions(expected)}, "resampling":"Pillow L bicubic; zero fill; zero outside target quad", "software":{"Pillow":Image.__version__, "numpy":np.__version__}, "identity_verified":False, "review_requirement":"Same owner must inspect whole image and alpha outline on checkerboard, light and dark backgrounds before promotion."}
    recheck_inputs(tracked)
    out.parent.mkdir(parents=True, exist_ok=True)
    receipt_path.parent.mkdir(parents=True, exist_ok=True)
    with out.open("xb") as handle:
        handle.write(png)
    try:
        with receipt_path.open("x", encoding="utf-8", newline="\n") as handle:
            json.dump(receipt, handle, indent=2, allow_nan=False)
            handle.write("\n")
    except Exception as exc:
        raise RuntimeError(f"Candidate saved at {out}; receipt failed. Candidate must not be accepted without receipt") from exc
    return receipt


def verify(config_path, receipt_path, candidate_path):
    expected, invariant, out, configured_receipt, tracked = build_expected(config_path)
    receipt_path, candidate_path = Path(receipt_path).resolve(), Path(candidate_path).resolve()
    require(receipt_path == configured_receipt and candidate_path == out, "Verify paths differ from immutable config")
    receipt, receipt_hash = read_json_bytes(receipt_path)
    for key, value in invariant.items():
        require(receipt.get(key) == value, f"Alpha receipt invariant mismatch: {key}")
    require(receipt.get("identity_verified") is False, "Alpha helper cannot approve product identity")
    candidate_bytes = candidate_path.read_bytes()
    candidate_hash = digest(candidate_bytes)
    require(receipt.get("final") == {"path":str(candidate_path), "sha256":candidate_hash, "dimensions":dimensions(expected)}, "Alpha final path/hash/dimensions mismatch")
    with Image.open(io.BytesIO(candidate_bytes)) as raw:
        require(raw.format == "PNG" and raw.mode == "RGBA", "Alpha candidate must be RGBA PNG")
        actual = ImageOps.exif_transpose(raw).convert("RGBA")
    require(actual.size == expected.size and actual.tobytes() == expected.tobytes(), "Alpha candidate decoded pixels differ from deterministic replay")
    require(digest(actual.convert("RGB").tobytes()) == receipt["decoded_rgb_sha256"] and digest(actual.getchannel("A").tobytes()) == receipt["alpha_sha256"], "Alpha decoded channel hashes mismatch")
    recheck_inputs({**tracked, receipt_path:receipt_hash, candidate_path:candidate_hash})
    return {"verified":True, "method":METHOD, "sku":invariant["sku"], "final_sha256":candidate_hash, "decoded_rgb_sha256":invariant["decoded_rgb_sha256"], "alpha_sha256":invariant["alpha_sha256"], "writes":0}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true", help="Read-only deterministic replay")
    parser.add_argument("paths", nargs="+")
    args = parser.parse_args()
    require_count = 3 if args.verify else 1
    if len(args.paths) != require_count:
        parser.error("Use --verify CONFIG RECEIPT CANDIDATE, or CONFIG to create")
    try:
        result = verify(*args.paths) if args.verify else create(args.paths[0])
    except (ValueError, KeyError, OSError, TypeError, RuntimeError) as exc:
        parser.exit(1, f"Alpha operation refused: {exc}\n")
    if not args.verify:
        result = {"final":result["final"], "identity_verified":False}
    print(json.dumps(result, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
