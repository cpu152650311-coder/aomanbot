#!/usr/bin/env python3
"""Generate blog images for government public sector post using GPT Image 2."""
import os, sys, base64, time, subprocess
from pathlib import Path
from openai import OpenAI

api_key = os.environ.get("AIHUBMIX_API_KEY")
if not api_key:
    env_path = Path.home() / '.hermes' / '.env'
    if env_path.exists():
        for line in env_path.read_text(encoding='utf-8').splitlines():
            if line.startswith('AIHUBMIX_API_KEY='):
                api_key = line.split('=', 1)[1].strip().strip('"').strip("'")
                break
if not api_key:
    print("ERROR: AIHUBMIX_API_KEY not found")
    sys.exit(1)

client = OpenAI(api_key=api_key, base_url="https://aihubmix.com/v1")

out_dir = Path("public/blog-images/service-robots-government-public-sector-2026")
out_dir.mkdir(parents=True, exist_ok=True)

images = [
    ("cover", "abstract corporate photography, grand government civic building atrium with towering marble columns and polished reflective stone floor, warm golden hour light streaming through tall windows creating long luminous light trails on the floor, navy blue and gold color palette, elegant geometric architectural patterns, professional atmosphere, no robots, no machines, no vehicles, no product renders, no people faces, no text, no logos"),

    ("section-1", "abstract luxury interior visualization, sweeping illuminated curved pathways flowing through a modern civic architecture space, cyan and gold light ribbons tracing elegant arcs across polished dark stone surfaces, prismatic light refractions from unseen glass panels, depth and perspective emphasizing grand scale, corporate professional aesthetic, no robots, no machines, no vehicles, no product renders, no people faces, no text, no logos"),

    ("section-2", "abstract geometric corridor composition, intersecting planes of brushed metal and dark glass forming a secure institutional passageway, thin luminous cyan light lines tracing the edges and corners, warm gold accent highlights reflecting off polished surfaces, sense of order precision and security, clean minimal architectural photography style, no robots, no machines, no vehicles, no product renders, no people faces, no text, no logos"),

    ("section-3", "abstract data visualization aesthetic, flowing streams of cyan and gold light particles forming wave patterns and data-like flows across a dark navy background, geometric grid lines faintly visible beneath, corporate analytics dashboard atmosphere rendered as physical light installation, elegant and sophisticated, no robots, no machines, no vehicles, no product renders, no people faces, no text, no logos"),

    ("section-4", "abstract civic service atmosphere, warm ambient light diffusing through a modern minimal government lobby with soft beige and gold tones, subtle cyan accent lighting along the edges of architectural elements, calm organized professional environment, wide angle perspective with depth, sense of trust and reliability, no robots, no machines, no vehicles, no product renders, no people faces, no text, no logos"),

    ("cta", "abstract corporate brand texture, dark navy blue gradient background with subtle cyan and gold geometric line patterns resembling circuit traces or architectural blueprints, low contrast elegant pattern, soft luminous highlights, designed as a subtle background texture for text overlay, no robots, no machines, no vehicles, no product renders, no people faces, no text, no logos"),
]

total = len(images)
for i, (img_id, prompt) in enumerate(images):
    raw_path = out_dir / f"{img_id}_raw.webp"
    final_path = out_dir / f"{img_id}.webp"
    if final_path.exists():
        print(f"[{i+1}/{total}] {img_id}: SKIP (exists)")
        continue
    print(f"[{i+1}/{total}] {img_id}: generating...", flush=True)
    try:
        resp = client.images.generate(
            model="gpt-image-2", prompt=prompt,
            n=1, size="1024x1024", quality="low"
        )
    except Exception as e:
        print(f"  Primary failed ({e}), trying fallback...")
        try:
            client2 = OpenAI(api_key=api_key, base_url="https://api.inferera.com/v1")
            resp = client2.images.generate(
                model="gpt-image-2", prompt=prompt,
                n=1, size="1024x1024", quality="low"
            )
        except Exception as e2:
            print(f"  Fallback also failed: {e2}")
            continue
    b64 = resp.data[0].b64_json
    with open(raw_path, "wb") as f:
        f.write(base64.b64decode(b64))
    subprocess.run(
        ["cwebp", "-q", "75", "-m", "6", str(raw_path), "-o", str(final_path)],
        check=True
    )
    raw_path.unlink()
    size_kb = final_path.stat().st_size / 1024
    print(f"  -> {final_path.name} ({size_kb:.0f} KB)", flush=True)
    time.sleep(1)

print("\n--- Final files ---")
for f in sorted(out_dir.glob("*.webp")):
    print(f"  {f.name}: {f.stat().st_size/1024:.0f} KB")
