import base64, time, os, sys
from openai import OpenAI

client = OpenAI(api_key=os.environ["AIHUBMIX_API_KEY"], base_url="https://aihubmix.com/v1")

OUT_DIR = "/home/ubuntu/projects/aomanbot/public/blog-images/delivery-robot-selection-guide-2026"

images = [
    {
        "name": "cover.webp",
        "prompt": "photorealistic modern white delivery robot in a sleek upscale hotel lobby, marble floors, warm ambient lighting, 3D render, product photography style, no people faces, no text, no logos"
    },
    {
        "name": "diagram.webp",
        "prompt": "photorealistic macro studio shot of two delivery robots side by side on a dark surface, one compact single-body white robot with stacked trays and one larger white robot with two separate compartments, professional product photography lighting, no people faces, no text, no logos"
    },
    {
        "name": "section-1.webp",
        "prompt": "modern restaurant interior with autonomous white delivery robot moving between wooden tables, warm cozy lighting, upscale dining atmosphere, photorealistic, no people faces, no text, no logos"
    },
    {
        "name": "section-2.webp",
        "prompt": "luxury hotel corridor at night with autonomous service robot approaching a guest room door, soft warm hallway lighting, carpeted floor, upscale interior design, photorealistic, no people faces, no text, no logos"
    },
    {
        "name": "section-3.webp",
        "prompt": "bright clean hospital corridor with autonomous white delivery robot transporting medical supplies, clinical lighting, white walls, modern healthcare facility, photorealistic, no people faces, no text, no logos"
    },
]

for i, img in enumerate(images):
    path = os.path.join(OUT_DIR, img["name"])
    if os.path.exists(path):
        print(f"[{i+1}/{len(images)}] SKIP {img['name']} (exists)")
        continue
    try:
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
        print(f"[{i+1}/{len(images)}] OK {img['name']} ({size_kb:.0f} KB)")
        time.sleep(1.5)
    except Exception as e:
        print(f"[{i+1}/{len(images)}] FAIL {img['name']}: {e}")

print("DONE")
