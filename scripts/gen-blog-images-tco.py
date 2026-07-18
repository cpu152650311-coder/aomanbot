#!/usr/bin/env python3
"""Generate 5 abstract scene images for aomanbot blog post.
Rules: NO robots, NO machines, NO humans, NO infographic/flowchart/arrows.
Only abstract scenes with light trails, reflections, geometric patterns."""

import os, base64, time, subprocess
from openai import OpenAI

client = OpenAI(api_key=os.environ["AIHUBMIX_API_KEY"], base_url="https://aihubmix.com/v1")

OUT_DIR = "/home/ubuntu/projects/aomanbot/public/blog-images/service-robot-maintenance-tco-guide-2026"
os.makedirs(OUT_DIR, exist_ok=True)

images = [
    {
        "name": "section-1",
        "prompt": "Abstract visualization of intersecting light beams and geometric grid patterns in deep blue and teal tones against a dark technical background, representing structured service workflow, photorealistic 3D render style, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-2",
        "prompt": "Flowing streams of light particles forming interconnected nodes and network topology in a dark void, blue and cyan data streams with subtle orange accent points, representing data connectivity and fleet communication, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-3",
        "prompt": "Two diverging geometric light pathways — one smooth with clean parallel lines, the other fragmented with scattered particles — in deep navy and silver tones, representing system optimization vs disruption, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-4",
        "prompt": "Layered translucent geometric panels forming a protective dome structure, illuminated from within with soft blue-white light, glossy reflective floor surface below, representing protection and warranty coverage, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-5",
        "prompt": "Undulating waves of light forming financial data patterns over a dark geometric grid, deep blue gradient with silver highlights, representing cost analysis and total cost of ownership modeling, no robots, no machines, no humans, no text, no logos"
    },
]

for i, img in enumerate(images):
    path = os.path.join(OUT_DIR, f"{img['name']}.webp")
    print(f"[{i+1}/5] Generating {img['name']}...")
    
    resp = client.images.generate(
        model="gpt-image-2",
        prompt=img["prompt"],
        n=1,
        size="1024x1024",
        quality="low"
    )
    b64 = resp.data[0].b64_json
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64))
    
    size_kb = os.path.getsize(path) / 1024
    print(f"  → Saved: {size_kb:.0f} KB")
    
    if i < len(images) - 1:
        time.sleep(1.5)

# Compress with cwebp
print("\nCompressing...")
for img in images:
    path = os.path.join(OUT_DIR, f"{img['name']}.webp")
    before = os.path.getsize(path) / 1024
    subprocess.run(
        ["cwebp", "-q", "75", "-m", "6", path, "-o", f"{path}.tmp"],
        check=True, capture_output=True
    )
    os.rename(f"{path}.tmp", path)
    after = os.path.getsize(path) / 1024
    print(f"  {img['name']}: {before:.0f}KB → {after:.0f}KB ({after/before*100:.0f}%)")

# Verify
print("\nVerification:")
for img in images:
    path = os.path.join(OUT_DIR, f"{img['name']}.webp")
    size = os.path.getsize(path)
    status = "✓" if size < 200*1024 else "✗ OVER 200KB"
    print(f"  {img['name']}.webp: {size/1024:.0f} KB {status}")

print(f"\nDone: {len(images)} images in {OUT_DIR}")
