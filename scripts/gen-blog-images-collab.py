#!/usr/bin/env python3
"""Generate blog images for human-robot-collaboration-2026.
AOMAN constraints: NO robots, machines, vehicles, product renders.
Use abstract scenes: light trails, reflections, geometric patterns."""

import os, sys, time, subprocess, base64
from openai import OpenAI

API_KEY = os.environ.get("AIHUBMIX_API_KEY")
if not API_KEY:
    print("FATAL: AIHUBMIX_API_KEY not set")
    sys.exit(1)

client = OpenAI(api_key=API_KEY, base_url="https://aihubmix.com/v1")
OUT_DIR = "/home/ubuntu/projects/aomanbot/public/blog-images/human-robot-collaboration-2026"

IMAGES = [
    {
        "id": "cover",
        "prompt": (
            "Professional corporate marketing photo, abstract composition. "
            "Warm golden and soft blue light trails intersecting on a polished dark floor, "
            "suggesting collaboration and harmony. Subtle reflection patterns, clean minimalist aesthetic. "
            "Corporate atmosphere, premium feel. No text, no logos, no people faces. "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "hero-bg",
        "prompt": (
            "Wide abstract corporate background, soft gradient from deep blue to warm amber. "
            "Geometric light beams intersecting in an architectural space with polished surfaces. "
            "Suggests technology meeting humanity. Clean, airy, professional. "
            "No text, no logos, no people faces. "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "section-1",
        "prompt": (
            "Abstract macro photography of interconnected light nodes on a dark surface, "
            "resembling a network or communication web. Soft blue and gold illumination, "
            "shallow depth of field. Suggests connection and teamwork. "
            "Modern corporate aesthetic. No text, no logos, no people faces. "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "section-2",
        "prompt": (
            "Abstract visualization of data and metrics. Clean geometric patterns of translucent "
            "layers in navy blue and teal, overlapping with soft golden highlights. "
            "Premium corporate aesthetic, suggests growth and measurement. "
            "No text, no logos, no people faces. "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "section-3",
        "prompt": (
            "Warm abstract composition of soft light passing through architectural glass panels, "
            "creating prismatic color patterns on a polished floor. "
            "Suggests transformation and a brighter future. "
            "Professional, optimistic mood. No text, no logos, no people faces. "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
    {
        "id": "cta-bg",
        "prompt": (
            "Abstract brand atmosphere image. Deep navy blue background with subtle diagonal "
            "light streaks in cyan (#00A2FF) and soft white. Minimalist, premium tech aesthetic. "
            "Suggests innovation and trust. Smooth gradient, no harsh lines. "
            "No text, no logos, no people faces. "
            "no robots, no machines, no vehicles, no product renders."
        ),
    },
]

for img in IMAGES:
    out_path = os.path.join(OUT_DIR, f"{img['id']}.webp")
    raw_path = os.path.join(OUT_DIR, f"{img['id']}_raw.webp")
    
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
        print(f"done ({os.path.getsize(raw_path)} bytes)", end=" ", flush=True)
        
        # Compress with cwebp (in Python subprocess to avoid shell loop silent loss)
        result = subprocess.run(
            ["cwebp", "-q", "75", "-m", "6", raw_path, "-o", out_path],
            capture_output=True, text=True, check=True
        )
        os.remove(raw_path)
        final_size = os.path.getsize(out_path)
        print(f"→ compressed {final_size} bytes")
        
        if final_size > 200_000:
            print(f"  ⚠️  WARNING: {img['id']} is {final_size} bytes (>200KB target)")
        
    except Exception as e:
        print(f"FAILED: {e}")
    
    time.sleep(1.5)

# Verify all files
print("\n=== Verification ===")
for img in IMAGES:
    path = os.path.join(OUT_DIR, f"{img['id']}.webp")
    if os.path.exists(path):
        size_kb = os.path.getsize(path) / 1024
        print(f"  ✓ {img['id']}.webp — {size_kb:.1f} KB")
    else:
        print(f"  ✗ {img['id']}.webp — MISSING")

print(f"\nTotal files: {len(os.listdir(OUT_DIR))}")
print("Done!")
