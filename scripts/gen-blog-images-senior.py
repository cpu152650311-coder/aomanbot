import base64, os, time, json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AIHUBMIX_API_KEY"],
    base_url="https://aihubmix.com/v1"
)

slug = "service-robots-senior-living-facilities-2026"
base = f"/home/ubuntu/projects/aomanbot/public/blog-images/{slug}"

images = [
    {
        "name": "cover",
        "prompt": "Warm modern senior living facility common area interior, soft natural sunlight through large windows, comfortable lounge chairs, polished wooden floor, indoor plants, calm and serene atmosphere, professional architectural photography, warm neutral tones, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-1",
        "prompt": "Clean bright corridor in modern healthcare facility, soft indirect lighting, polished terrazzo floor with subtle reflections, wide hallway with handrails, minimalist design, calm healing environment, professional interior photography, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-2",
        "prompt": "Soft golden hour light streaming through window onto polished wooden floor in a quiet residential room, gentle shadows, peaceful warm atmosphere, high-end senior residence interior detail, architectural photography, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-3",
        "prompt": "Warm amber light reflecting on polished marble floor in an elegant hotel-style lobby, soft bokeh background, luxurious calm atmosphere, architectural detail shot, golden and cream tones, no robots, no machines, no humans, no text, no logos"
    },
    {
        "name": "section-4",
        "prompt": "Abstract visualization of soft blue light trails tracing curved paths through a modern building interior at twilight, gentle glowing pathways, calm nighttime atmosphere, long exposure photography style, architectural lighting, no robots, no machines, no humans, no text, no logos"
    },
]

for i, img in enumerate(images):
    print(f"[{i+1}/{len(images)}] Generating {img['name']}...")
    resp = client.images.generate(
        model="gpt-image-2",
        prompt=img["prompt"],
        n=1,
        size="1024x1024",
        quality="low"
    )
    b64 = resp.data[0].b64_json
    path = f"{base}/{img['name']}.webp"
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64))
    size_kb = os.path.getsize(path) / 1024
    print(f"  -> {img['name']}.webp ({size_kb:.0f} KB)")
    if i < len(images) - 1:
        time.sleep(1)

print("\nDone. Files:")
for f in sorted(os.listdir(base)):
    size = os.path.getsize(f"{base}/{f}") / 1024
    print(f"  {f} ({size:.0f} KB)")
