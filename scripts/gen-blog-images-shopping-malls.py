#!/usr/bin/env python3
"""Generate abstract blog images for Shopping Malls article."""
import base64, os, time, subprocess
from openai import OpenAI

client = OpenAI(api_key=os.environ["AIHUBMIX_API_KEY"], base_url="https://aihubmix.com/v1")

slug = "service-robots-shopping-malls-retail-complexes-2026"
out_dir = f"public/blog-images/{slug}"

images = [
    {
        "name": "section-1",
        "prompt": "Abstract architectural visualization of light trails flowing through a grand multi-level shopping atrium with glass ceiling, golden ambient illumination reflecting off polished marble floors, geometric patterns of interconnected walkways, luxury retail environment, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-2",
        "prompt": "Abstract visualization of interconnected geometric patterns suggesting crowd movement through a modern commercial complex, warm silver and gold intersecting pathways, ambient blue accent lighting, architectural depth with glass and steel surfaces, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-3",
        "prompt": "Abstract flowing patterns of silver and white light sweeping across a dark polished floor surface, clean minimalist aesthetic suggesting automated maintenance, reflective surfaces with subtle blue ambient glow, modern commercial interior atmosphere, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "name": "section-4",
        "prompt": "Professional corporate visualization of interconnected commercial spaces, multi-level perspective with warm golden light transitioning to cool blue tones, abstract architectural forms suggesting retail and dining zones converging into a central hub, glass reflections and geometric light patterns, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
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
