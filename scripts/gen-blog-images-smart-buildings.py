import base64, os, time, subprocess
from openai import OpenAI

client = OpenAI(api_key=os.environ["AIHUBMIX_API_KEY"], base_url="https://aihubmix.com/v1")

slug = "service-robots-smart-office-buildings-corporate-campuses-2026"
out_dir = f"public/blog-images/{slug}"

images = [
    {
        "path": f"{out_dir}/section-1.webp",
        "prompt": "Abstract architectural visualization of light trails flowing through a modern glass office building atrium, interconnected floors with glowing pathways, corporate blue and silver tones, professional atmosphere, clean geometric composition, no robots, no machines, no vehicles, no product renders, no humans, no text, no logos"
    },
    {
        "path": f"{out_dir}/section-2.webp",
        "prompt": "Abstract visualization of interconnected building systems, geometric patterns suggesting HVAC access control and data networks converging, blue white and teal palette, technology integration concept, clean minimal architectural style, no robots no machines no vehicles no product renders no humans no text no logos"
    },
    {
        "path": f"{out_dir}/section-3.webp",
        "prompt": "Abstract data streams and connectivity visualization flowing through an architectural space, blue and silver light beams crisscrossing a modern corporate environment, network topology aesthetic, clean tech-forward atmosphere, no robots no machines no vehicles no product renders no humans no text no logos"
    },
    {
        "path": f"{out_dir}/section-4.webp",
        "prompt": "Abstract efficiency and optimization patterns, layered translucent geometric shapes in corporate blue teal and white suggesting workflow automation, rhythmic repetition of clean architectural forms, modern enterprise aesthetic, no robots no machines no vehicles no product renders no humans no text no logos"
    },
    {
        "path": f"{out_dir}/section-5.webp",
        "prompt": "Abstract futuristic smart building concept, glass and steel architecture with integrated glowing technology lines, sunrise light illuminating a corporate campus skyline, blue white and warm amber tones, aspirational enterprise atmosphere, no robots no machines no vehicles no product renders no humans no text no logos"
    },
]

for img in images:
    print(f"Generating: {img['path']}...")
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
    print(f"  Done: {img['path']}")

# Compress with cwebp
print("\nCompressing images...")
for img in images:
    raw_path = img["path"]
    final_path = raw_path
    result = subprocess.run(
        ["cwebp", "-q", "75", "-m", "6", raw_path, "-o", f"{raw_path}.tmp"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"cwebp failed for {raw_path}: {result.stderr}")
    subprocess.run(["mv", f"{raw_path}.tmp", final_path], check=True)
    size_kb = os.path.getsize(final_path) / 1024
    print(f"  {os.path.basename(final_path)}: {size_kb:.0f} KB")

# Verify all files exist
print("\nVerification:")
for img in images:
    if os.path.exists(img["path"]):
        print(f"  ✓ {img['path']}")
    else:
        print(f"  ✗ MISSING: {img['path']}")
