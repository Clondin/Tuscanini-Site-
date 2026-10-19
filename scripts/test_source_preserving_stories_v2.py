"""Focused synthetic geometry, family boundaries, immutable pins and replay tests."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import numpy as np
from PIL import Image

sys.dont_write_bytecode = True
SITE = Path(__file__).resolve().parents[1]
SCRIPT = SITE / "scripts/source-preserving-stories-v2.py"
spec = importlib.util.spec_from_file_location("stories", SCRIPT)
tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)


def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2), encoding="utf-8")


def fixture(root, role="family", member="730101"):
    root = Path(root).resolve()
    job, old = root / "job", root / "old"
    sku_root = job / "skus/730100"
    sku_root.mkdir(parents=True)
    paths = {}
    for index, sku in enumerate(["730100", "730101", "730102", "730103"]):
        path = old / "skus" / sku / "source.png"
        path.parent.mkdir(parents=True)
        a = np.zeros((16, 16, 4), dtype=np.uint8)
        a[1:15, 1:15] = [190 - index * 30, 40 + index * 40, 55, 255]
        a[5:9, 5:9] = [20, 230, 95, 255]
        Image.fromarray(a).save(path)
        paths[sku] = path
    base = root / "generated_images/raw.png"
    base.parent.mkdir()
    pixels = np.zeros((24, 24, 4), dtype=np.uint8)
    pixels[2:22, 2:22] = [80, 90, 110, 255]
    Image.fromarray(pixels).save(base)
    plan = root / "plan.json"
    dump(plan, {"schema_version":"tuscanini-catalog-creative-reset/v1", "sourceCatalog":{s:{} for s in paths},
        "skuAssignments":[{"sku":"730100", "companionSkus":["730101", "730102"]}]})
    approval_path = job / "approvals/v1.json"
    approval = {"schema_version":tool.APPROVAL_SCHEMA,"approved":True,"approvedBy":"user",
        "approvedAt":"2026-10-19T12:00:00+00:00","method":tool.METHOD,
        "toolkit":{"path":str(SCRIPT),"sha256":tool.file_hash(SCRIPT)},
        "renderer":{"path":str(SCRIPT.with_name("source-preserving-composite.py")),"sha256":tool.V1_SHA},
        "creativePlan":{"path":str(plan),"sha256":tool.file_hash(plan)},
        "skus":["730100"],"owners":{s:f"/root/sku_{s}" for s in paths},
        "sourceRoots":{s:str(p.parent) for s,p in paths.items()},
        "sourceCatalog":{s:[{"path":str(p),"sha256":tool.file_hash(p),"scope":"exact-package","status":"matched",
            "reviewer":f"/root/sku_{s}","notes":"Synthetic test source qualified by its own original owner; not catalog artwork."}] for s,p in paths.items()}}
    dump(approval_path, approval)
    source = paths[member]
    source_hash = tool.file_hash(source)
    config_path = sku_root / "candidate.config.json"
    config = {"schema_version":tool.SCHEMA,"sku":"730100","role":role,
        "approval":{"path":str(approval_path),"sha256":tool.file_hash(approval_path)},
        "imagegen_base":{"path":str(base),"sha256":tool.file_hash(base)},
        "sources":[{"source_sku":member,"path":str(source),"sha256":source_hash,"scope":"exact-package","status":"matched",
            "reviewer":"/root/sku_730100","notes":"Synthetic hero owner viewed this assigned source and compared the patch."}],
        "review":{"source_and_base_viewed":True,"reviewer":"/root/sku_730100","viewed_at":"2026-10-19T12:01:00+00:00"},
        "patches":[{"id":"label","source_sku":member,"source_path":str(source),"source_sha256":source_hash,
            "source_quad":[[2,2],[13,2],[13,13],[2,13]],"target_quad":[[2,2],[13,2],[13,13],[2,13]],
            "feather_px":0,"color_match":{"mode":"none"}}],
        "output_path":str(sku_root / "candidate.png"),"receipt_path":str(sku_root / "candidate.receipt.json")}
    dump(config_path, config)
    return {"root":root,"job":job,"sku_root":sku_root,"base":base,"paths":paths,"plan":plan,
        "approval_path":approval_path,"approval":approval,"config_path":config_path,"config":config}


class ToolkitTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.f = fixture(self.temp.name)
    def tearDown(self):
        self.temp.cleanup()
    def save(self):
        dump(self.f["config_path"],self.f["config"])
    def repin(self):
        dump(self.f["approval_path"],self.f["approval"])
        self.f["config"]["approval"]["sha256"] = tool.file_hash(self.f["approval_path"])
        self.save()
    def reject(self, text):
        self.save()
        with self.assertRaisesRegex(ValueError,text): tool.create(self.f["config_path"])
    def test_family_assigned_source_exact_geometry_alpha_and_input_unchanged(self):
        before = {p:tool.file_hash(p) for p in [self.f["base"],*self.f["paths"].values(),self.f["config_path"],self.f["approval_path"]]}
        result=tool.create(self.f["config_path"])
        actual=np.asarray(Image.open(result["final"]["path"]))
        original=np.asarray(Image.open(self.f["paths"]["730101"]))
        self.assertTrue(np.array_equal(actual[3:12,3:12],original[3:12,3:12]))
        self.assertTrue(np.array_equal(actual[:,:,3],np.asarray(Image.open(self.f["base"]))[:,:,3]))
        self.assertEqual(before,{p:tool.file_hash(p) for p in before})
        receipt=json.loads(Path(self.f["config"]["receipt_path"]).read_text())
        self.assertEqual(receipt["assignment"]["companionSkus"],["730101","730102"])
        self.assertEqual(receipt["patches"][0]["source_sha256"],before[self.f["paths"]["730101"]])
        self.assertFalse(receipt["identity_verified"])
    def test_replay_cli_has_no_writes(self):
        tool.create(self.f["config_path"])
        before={p:(tool.file_hash(p),p.stat().st_mtime_ns) for p in self.f["root"].rglob("*") if p.is_file()}
        result=subprocess.run([sys.executable,str(SCRIPT),"--verify",str(self.f["config_path"]),self.f["config"]["receipt_path"],self.f["config"]["output_path"]],capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual(json.loads(result.stdout)["writes"],0)
        self.assertEqual(before,{p:(tool.file_hash(p),p.stat().st_mtime_ns) for p in self.f["root"].rglob("*") if p.is_file()})
    def test_own_use(self):
        self.f["config"]["role"]="use"
        own=self.f["paths"]["730100"]
        self.f["config"]["sources"][0].update(source_sku="730100",path=str(own),sha256=tool.file_hash(own))
        self.f["config"]["patches"][0].update(source_sku="730100",source_path=str(own),source_sha256=tool.file_hash(own))
        self.save(); tool.create(self.f["config_path"])
    def test_use_cannot_consume_companion(self):
        self.f["config"]["role"]="use"; self.reject("Source SKU not allowed")
    def test_occasion_cannot_consume_companion(self):
        self.f["config"]["role"]="occasion"; self.reject("Source SKU not allowed")
    def test_unassigned_family_source_rejected(self):
        self.f["config"]["sources"][0]["source_sku"]="730103"; self.reject("Source SKU not allowed")
    def test_changed_approval_rejected_without_repin(self):
        self.f["approval"]["approvedAt"]="2026-10-19T13:00:00+00:00"; dump(self.f["approval_path"],self.f["approval"])
        self.reject("approval hash mismatch")
    def test_original_source_owner_qualification_required(self):
        self.f["approval"]["sourceCatalog"]["730101"][0]["reviewer"]="/root/sku_730100"; self.repin(); self.reject("Original source-SKU qualification")
    def test_missing_source_qualification_rejected(self):
        self.f["approval"]["sourceCatalog"]["730101"]=[]; self.repin(); self.reject("uniquely pinned")
    def test_hero_owner_required(self):
        self.f["config"]["review"]["reviewer"]="/root/sku_730101"; self.reject("original hero owner")
    def test_source_hash_mismatch_rejected(self):
        self.f["paths"]["730101"].write_bytes(b"changed source"); self.reject("Source hash mismatch")
    def test_duplicate_source_alias_rejected(self):
        self.f["config"]["sources"].append(copy.deepcopy(self.f["config"]["sources"][0])); self.reject("Duplicate/aliased")
    def test_patch_source_sku_must_match_review(self):
        self.f["config"]["patches"][0]["source_sku"]="730100"; self.reject("SKU/hash differs")
    def test_invalid_quad_rejected(self):
        self.f["config"]["patches"][0]["source_quad"][0]=[-1,2]; self.reject("bounds")
    def test_crossed_quad_rejected(self):
        self.f["config"]["patches"][0]["target_quad"]=[[2,2],[13,13],[13,2],[2,13]]; self.reject("convex|area")
    def test_input_output_alias_rejected(self):
        self.f["config"]["output_path"]=str(self.f["config_path"]); self.reject("PNG|aliases")
    def test_existing_candidate_not_overwritten(self):
        output=Path(self.f["config"]["output_path"]); output.write_bytes(b"keep")
        self.reject("new files"); self.assertEqual(output.read_bytes(),b"keep")
    def test_receipt_pixel_forgery_rejected_even_with_final_hash_updated(self):
        tool.create(self.f["config_path"])
        output=Path(self.f["config"]["output_path"]); a=np.asarray(Image.open(output)).copy(); a[8,8,0]^=1; Image.fromarray(a).save(output)
        rp=Path(self.f["config"]["receipt_path"]); receipt=json.loads(rp.read_text()); receipt["final"]["sha256"]=tool.file_hash(output); dump(rp,receipt)
        with self.assertRaisesRegex(ValueError,"decoded pixels"):
            tool.verify(self.f["config_path"],rp,output)
    def test_versioned_approval_does_not_depend_on_latest(self):
        dump(self.f["job"] / "approvals/latest.json",{"not":"the pinned approval"})
        tool.create(self.f["config_path"])
    def test_approved_source_wrong_root_rejected(self):
        self.f["approval"]["sourceRoots"]["730101"]=str(self.f["paths"]["730102"].parent); self.repin(); self.reject("own SKU folder")
    def test_toolkit_pin_required(self):
        self.f["approval"]["toolkit"]["sha256"]="0"*64; self.repin(); self.reject("toolkit pin mismatch")
    def test_renderer_pin_required(self):
        self.f["approval"]["renderer"]["sha256"]="0"*64; self.repin(); self.reject("unchanged v1 renderer")
    def test_product_cannot_consume_companion(self):
        self.f["config"]["role"]="product"; self.reject("Source SKU not allowed")
    def test_own_product_and_occasion(self):
        for role in ["product","occasion"]:
            f=fixture(Path(self.temp.name)/role,role=role,member="730100")
            tool.create(f["config_path"])
    def test_perspective_and_feather_replay(self):
        self.f["config"]["patches"][0].update(target_quad=[[3,3],[20,5],[18,19],[4,18]],feather_px=2,
            color_match={"mode":"mean_rgb_gain","max_gain_delta":0.1})
        self.save(); tool.create(self.f["config_path"])
        tool.verify(self.f["config_path"],self.f["config"]["receipt_path"],self.f["config"]["output_path"])
    def test_qualified_component_has_own_explicit_root(self):
        p=self.f["root"] / "components/730101/qualified-label.png"
        p.parent.mkdir(parents=True); p.write_bytes(self.f["paths"]["730101"].read_bytes())
        source=self.f["config"]["sources"][0]; source.update(path=str(p),scope="qualified-component",status="matched-components")
        self.f["config"]["patches"][0]["source_path"]=str(p)
        qualified=copy.deepcopy(self.f["approval"]["sourceCatalog"]["730101"][0]); qualified.update(path=str(p),scope="qualified-component",status="matched-components")
        self.f["approval"]["sourceCatalog"]["730101"]=[qualified]
        self.f["approval"]["componentRoots"]={"730101":str(p.parent)}
        self.repin(); tool.create(self.f["config_path"])
    def test_unused_declared_source_rejected(self):
        p=self.f["paths"]["730102"]
        s=copy.deepcopy(self.f["config"]["sources"][0]); s.update(source_sku="730102",path=str(p),sha256=tool.file_hash(p))
        self.f["config"]["sources"].append(s); self.reject("exactly equal consumed")
    def test_approval_outside_new_job_rejected(self):
        p=self.f["root"] / "outside-approval.json"; dump(p,self.f["approval"])
        self.f["config"]["approval"]={"path":str(p),"sha256":tool.file_hash(p)}; self.reject("inside this story job")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--fixture":
        f=fixture(sys.argv[2]); tool.create(f["config_path"])
        print(json.dumps({k:str(f[k]) for k in ["job","sku_root","base","config_path","approval_path"]}))
    else:
        unittest.main()
