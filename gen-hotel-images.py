#!/usr/bin/env python3
"""Generate 5 abstract images for aomanbot hotel blog using GPT Image 2 via AIHUBMIX."""
import base64, os, subprocess, time, sys
from openai import OpenAI

API_KEY = os.environ.get("AIHUBMIX_API_KEY")
if not API_KEY:
    print("ERROR: AIHUBMIX_API_KEY not set")
    sys.exit(1)

client = OpenAI(api_key=API_KEY, base_url="https://aihubmix.com/v1")
out_dir = "/home/ubuntu/projects/aomanbot/public/blog-images/service-robots-hotels-resorts-2026"

images = [
    {
        "id": "section-1",
        "prompt": (
            "Abstract architectural visualization: illuminated golden light pathways flowing through "
            "an elegant luxury hotel atrium interior viewed from above. Warm ambient lighting, "
            "reflective polished marble floor surfaces, curved architectural lines suggesting modern "
            "hospitality design. Corporate luxury aesthetic. No people faces, no text, no logos, "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "section-2",
        "prompt": (
            "Abstract corporate visualization: luminous geometric light patterns intersecting across "
            "a dark reflective floor surface, suggesting coordinated movement and automation in "
            "a premium hospitality environment. Blue and gold intersecting light beams creating "
            "elegant grid patterns on polished stone. No people faces, no text, no logos, "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "section-3",
        "prompt": (
            "Abstract technology visualization: radial light beams emanating from a central bright "
            "point across a dark polished surface, representing data integration and connectivity "
            "flowing through a sophisticated digital ecosystem. Blue and white spectrum, clean "
            "minimal aesthetic. No people faces, no text, no logos, no robots, no machines, "
            "no vehicles, no product renders."
        ),
    },
    {
        "id": "section-4",
        "prompt": (
            "Abstract luxury visualization: sweeping arcs of golden warm light crossing a dark "
            "polished marble surface, suggesting orchestrated elegant movement through a premium "
            "hotel environment. Soft bokeh background with warm amber tones, depth and sophistication. "
            "No people faces, no text, no logos, no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "section-5",
        "prompt": (
            "Abstract precision visualization: converging lines of cool blue light flowing toward "
            "a central focal point on a dark reflective surface, evoking technological precision, "
            "integrated systems, and modern innovation. Clean geometric composition with subtle "
            "gradient depth. No people faces, no text, no logos, no robots, no machines, "
            "no vehicles, no product renders."
        ),
    },
]

generated = 0
for img in images:
    out_path = os.path.join(out_dir, f"{img['id']}.webp")
    raw_path = os.path.join(out_dir, f"{img['id']}_raw.webp")
    
    print(f"Generating {img['id']}...", end=" ", flush=True)
    try:
        resp = client.images.generate(
            model="gpt-image-2",
            prompt=img["prompt"],
            n=1,
            size="1024x1024",
            quality="low",
        )
        b64 = resp.data[0].b64_json
        with open(raw_path, "wb") as f:
            f.write(base64.b64decode(b64))
        
        # Compress with cwebp
        result = subprocess.run(
            ["cwebp", "-q", "75", "-m", "6", raw_path, "-o", out_path],
            capture_output=True, text=True, check=True
        )
        os.remove(raw_path)
        
        size_kb = os.path.getsize(out_path) / 1024
        print(f"OK ({size_kb:.0f}KB)")
        generated += 1
    except Exception as e:
        print(f"FAILED: {e}")
    
    time.sleep(2)  # Rate limit spacing

# Verify all files exist
print(f"\nDone: {generated}/5 generated")
for img in images:
    p = os.path.join(out_dir, f"{img['id']}.webp")
    if os.path.exists(p):
        print(f"  ✓ {img['id']}.webp ({os.path.getsize(p)/1024:.0f}KB)")
    else:
        print(f"  ✗ {img['id']}.webp MISSING")
