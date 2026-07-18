import os, base64, time, sys
from openai import OpenAI

api_key = os.environ.get("AIHUBMIX_API_KEY")
if not api_key:
    print("ERROR: AIHUBMIX_API_KEY not set")
    sys.exit(1)

client = OpenAI(api_key=api_key, base_url="https://aihubmix.com/v1")

out_dir = "/home/ubuntu/projects/aomanbot/public/blog-images/service-robot-fleet-management-2026"

images = [
    {
        "path": f"{out_dir}/section-1.webp",
        "prompt": (
            "Abstract architectural interior visualization: luminous cyan and white light trails "
            "weaving through a sleek modern hotel lobby with polished marble floors reflecting "
            "overhead geometric ceiling lights. Depth of field with foreground blur transitioning "
            "to sharp midground. Cool blue and warm amber tones. No humans, no robots, no machines, "
            "no vehicles, no product renders, no text, no logos, no faces, no arrows."
        )
    },
    {
        "path": f"{out_dir}/section-2.webp",
        "prompt": (
            "Luxury hotel atrium at twilight: warm golden light cascading through a multi-story "
            "glass ceiling onto polished stone flooring with subtle reflection patterns. Elegant "
            "architectural lines, curved balconies, ambient glow from recessed lighting. "
            "Moody and sophisticated atmosphere. No humans, no robots, no machines, "
            "no vehicles, no product renders, no text, no logos, no faces."
        )
    },
    {
        "path": f"{out_dir}/section-3.webp",
        "prompt": (
            "Expansive modern corporate atrium: dramatic converging light beams in cyan and soft "
            "white forming geometric patterns across a vast polished floor. Floor-to-ceiling glass walls "
            "with city skyline visible beyond. High contrast between illuminated floor and shadow areas. "
            "Clean architectural minimalism. No humans, no robots, no machines, no vehicles, "
            "no product renders, no text, no logos, no faces, no arrows."
        )
    },
    {
        "path": f"{out_dir}/section-4.webp",
        "prompt": (
            "Dawn light streaming through floor-to-ceiling glass panels of a modern corporate building "
            "entrance. Soft golden morning rays creating long shadows across polished terrazzo flooring. "
            "Minimalist reception area with warm wood accents and living green wall. Serene, professional "
            "atmosphere suggesting the start of a new day. No humans, no robots, no machines, no vehicles, "
            "no product renders, no text, no logos, no faces."
        )
    },
]

for i, img in enumerate(images):
    print(f"Generating image {i+1}/4: {os.path.basename(img['path'])}...")
    try:
        resp = client.images.generate(
            model="gpt-image-2",
            prompt=img["prompt"],
            n=1,
            size="1024x1024",
            quality="low"
        )
        b64 = resp.data[0].b64_json
        with open(img["path"], "wb") as f:
            f.write(base64.b64decode(b64))
        size_kb = os.path.getsize(img["path"]) / 1024
        print(f"  ✓ {os.path.basename(img['path'])} ({size_kb:.0f} KB)")
    except Exception as e:
        print(f"  ✗ {os.path.basename(img['path'])} FAILED: {e}")
    time.sleep(1.5)

print("\nAll done.")
