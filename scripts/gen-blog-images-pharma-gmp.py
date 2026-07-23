#!/usr/bin/env python3
"""Generate abstract blog images for Pharmaceutical GMP Manufacturing article."""
import base64, os, time, subprocess
from openai import OpenAI

client = OpenAI(api_key=os.environ["AIHUBMIX_API_KEY"], base_url="https://aihubmix.com/v1")

slug = "service-robots-pharmaceutical-gmp-manufacturing-2026"
out_dir = f"public/blog-images/{slug}"

images = [
    {
        "name": "cover",
        "prompt": "Professional pharmaceutical manufacturing atmosphere, pristine cleanroom corridor with soft cool blue-white ambient lighting, reflective polished epoxy flooring with subtle geometric grid pattern, stainless steel surfaces with controlled lighting, the feeling of sterility, precision, and GMP-grade quality control, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-1",
        "prompt": "Abstract visualization of interconnected cleanroom zones connected by luminous sterile pathways, cool blue and white geometric patterns suggesting pharmaceutical material flow through GMP classified areas, hexagonal grid motifs representing quality control checkpoints, polished floor reflections, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-2",
        "prompt": "Abstract composition of precise geometric data patterns emerging from a dark sterile surface, suggesting batch record traceability and serialization tracking systems, intersecting lines of white and cyan light forming matrix-like structures, pharmaceutical compliance visualization aesthetic, clean minimal design, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-3",
        "prompt": "Luminous amber and blue light trails flowing across a polished dark reflective floor surface, abstract representation of automated material transport through GMP zones, intersecting pathways with pharmaceutical-grade cleanliness aesthetic, warm golden highlights against deep navy background, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-4",
        "prompt": "Professional abstract visualization of concentric quality assurance rings radiating outward, cool pharmaceutical blue transitioning to clean white, geometric precision suggesting ISO-classified environmental monitoring zones, subtle hexagonal and circular pattern overlays, controlled laboratory atmosphere, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
]

for img in images:
    path = os.path.join(out_dir, f"{img['name']}.webp")
    if os.path.exists(path):
        print(f"SKIP {img['name']} — already exists")
        continue
    print(f"Generating {img['name']}...")
    resp = client.images.generate(
        model="gpt-image-2",
        prompt=img["prompt"],
        n=1, size="1024x1024", quality="low"
    )
    b64 = resp.data[0].b64_json
    raw_path = path.replace(".webp", "_raw.webp")
    with open(raw_path, "wb") as f:
        f.write(base64.b64decode(b64))
    # Compress
    subprocess.run(["cwebp", "-q", "75", "-m", "6", raw_path, "-o", path], check=True)
    os.remove(raw_path)
    time.sleep(1.5)

# Verify
for img in images:
    path = os.path.join(out_dir, f"{img['name']}.webp")
    size_kb = os.path.getsize(path) / 1024 if os.path.exists(path) else 0
    print(f"  {img['name']}.webp: {size_kb:.0f} KB")

print(f"\nDone. {len(images)} images in {out_dir}/")
