"""
Umzugscheck.ch Service Image Generator
---------------------------------------
Generates brand-consistent service images via OpenAI gpt-image-1.5
and Gemini 3.1 Flash Image (Nano Banana 2), then builds a side-by-side
preview HTML for visual comparison and selection.

Usage:
    # Phase 1 — Stil-Test: Privatumzug x 3 styles x 2 APIs = 6 images
    python generate.py --phase 1

    # Phase 2 — Rollout: remaining 7 services in chosen style/api
    python generate.py --phase 2 --style photorealistic --api openai

    # Single image (Retries / Prompt-Tuning)
    python generate.py --service privatumzug --style illustration --api gemini
"""
from __future__ import annotations

import argparse
import base64
import json
import sys
from datetime import datetime
from pathlib import Path

import yaml
from dotenv import load_dotenv


SCRIPT_DIR = Path(__file__).parent
CONFIG_FILE = SCRIPT_DIR / "config.yaml"
STYLES_FILE = SCRIPT_DIR / "styles.yaml"
PREVIEW_DIR = SCRIPT_DIR / "preview"


# ---------- Config loading ----------

def load_config() -> dict:
    with open(CONFIG_FILE, encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_styles() -> dict:
    with open(STYLES_FILE, encoding="utf-8") as f:
        return yaml.safe_load(f)


# ---------- Prompt composition ----------

def build_prompt(service: dict, style: dict, brand: dict) -> str:
    """Compose final prompt from scene, style modifiers and brand anchor."""
    parts = [
        f"SCENE: {service['scene'].strip()}",
        f"STYLE: {style['description'].strip()}",
        f"BRAND CONTEXT: {brand['anchor'].strip()}",
        f"COMPOSITION: {style['composition'].strip()}",
        f"QUALITY: {style['quality'].strip()}",
    ]
    if brand.get("negative"):
        parts.append(f"AVOID: {brand['negative'].strip()}")
    return "\n\n".join(parts)


# ---------- API clients ----------

def generate_openai(prompt: str, out_path: Path, size: str = "1536x1024") -> None:
    """Generate via OpenAI gpt-image-1.5. Requires OPENAI_API_KEY in env."""
    from openai import OpenAI

    client = OpenAI()
    print(f"  → OpenAI gpt-image-1.5 generating {out_path.name}...")
    response = client.images.generate(
        model="gpt-image-1.5",
        prompt=prompt,
        size=size,
        quality="high",
        n=1,
    )
    image_b64 = response.data[0].b64_json
    image_bytes = base64.b64decode(image_b64)
    out_path.write_bytes(image_bytes)
    print(f"  ✓ {out_path.relative_to(SCRIPT_DIR)}  ({len(image_bytes) // 1024} KB)")


def generate_gemini(prompt: str, out_path: Path) -> None:
    """Generate via Gemini 3.1 Flash Image (Nano Banana 2).
    Requires GEMINI_API_KEY or GOOGLE_API_KEY in env."""
    from google import genai

    client = genai.Client()
    print(f"  → Gemini nano-banana-2 generating {out_path.name}...")
    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[prompt],
    )

    candidates = getattr(response, "candidates", None) or []
    if not candidates:
        raise RuntimeError("Gemini returned no candidates")

    for part in candidates[0].content.parts:
        inline = getattr(part, "inline_data", None)
        if inline is not None and getattr(inline, "data", None):
            raw = inline.data
            # SDK may return bytes or base64 string depending on version
            if isinstance(raw, str):
                raw = base64.b64decode(raw)
            out_path.write_bytes(raw)
            print(f"  ✓ {out_path.relative_to(SCRIPT_DIR)}  ({len(raw) // 1024} KB)")
            return

    raise RuntimeError("Gemini response contained no inline image data")


# ---------- Orchestration ----------

def generate_image(service_key: str, style_key: str, api: str,
                   config: dict, styles: dict, run_dir: Path) -> dict:
    """Generate a single image and return a result record."""
    if service_key not in config["services"]:
        raise ValueError(f"Unknown service: {service_key}")
    if style_key not in styles:
        raise ValueError(f"Unknown style: {style_key}")
    if api not in ("openai", "gemini"):
        raise ValueError(f"Unknown api: {api}")

    service = config["services"][service_key]
    style = styles[style_key]
    brand = config["brand"]
    prompt = build_prompt(service, style, brand)

    run_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{service_key}_{style_key}_{api}.png"
    out_path = run_dir / filename

    print(f"\n[{service_key} · {style_key} · {api}]")
    print(f"  Prompt length: {len(prompt)} chars")

    try:
        if api == "openai":
            generate_openai(prompt, out_path)
        else:
            generate_gemini(prompt, out_path)
        return {
            "service": service_key,
            "service_label": service.get("label", service_key),
            "style": style_key,
            "style_label": style.get("label", style_key),
            "api": api,
            "file": filename,
            "status": "ok",
        }
    except Exception as e:
        print(f"  ✗ FAILED: {type(e).__name__}: {e}")
        return {
            "service": service_key,
            "service_label": service.get("label", service_key),
            "style": style_key,
            "style_label": style.get("label", style_key),
            "api": api,
            "file": filename,
            "status": "error",
            "error": f"{type(e).__name__}: {e}",
        }


# ---------- Preview HTML ----------

def build_preview_html(results: list[dict], output_path: Path,
                       subfolder: str, title: str, subtitle: str) -> None:
    """Build a side-by-side Swiss-premium styled comparison page."""
    styles_order = ["photorealistic", "illustration", "isometric_3d"]
    results_by_style: dict[str, list[dict]] = {}
    for r in results:
        results_by_style.setdefault(r["style"], []).append(r)

    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    parts = [f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
  :root {{
    --primary: #0050A8;
    --accent: #E32026;
    --bg: #F5F7FA;
    --text: #1a1a1a;
    --muted: #6b7280;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif;
    background: var(--bg); color: var(--text);
    padding: 32px 24px; line-height: 1.5;
  }}
  header {{ max-width: 1600px; margin: 0 auto 32px; }}
  h1 {{ color: var(--primary); font-size: 28px; margin-bottom: 6px; letter-spacing: -0.01em; }}
  .sub {{ color: var(--muted); font-size: 15px; }}
  .legend {{ display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }}
  .legend span {{
    background: white; padding: 6px 12px; border-radius: 6px;
    font-size: 12px; color: var(--muted);
    box-shadow: 0 1px 2px rgba(0,0,0,.04);
  }}
  main {{ max-width: 1600px; margin: 0 auto; }}
  section.style-row {{ margin-bottom: 56px; }}
  section.style-row h2 {{
    color: var(--primary); font-size: 20px; margin-bottom: 6px;
    padding-bottom: 10px; border-bottom: 2px solid var(--primary);
    display: flex; align-items: baseline; gap: 12px;
  }}
  section.style-row h2 .tag {{ font-size: 12px; color: var(--muted); font-weight: 400; }}
  .style-desc {{ color: var(--muted); font-size: 14px; margin: 8px 0 20px; max-width: 800px; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(520px, 1fr)); gap: 20px; }}
  .card {{
    background: white; border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
    transition: transform .15s ease, box-shadow .15s ease;
  }}
  .card:hover {{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }}
  .card img {{
    width: 100%; aspect-ratio: 3/2; object-fit: cover;
    display: block; background: #eef0f3;
  }}
  .card .meta {{
    padding: 14px 18px; display: flex; justify-content: space-between;
    align-items: center; gap: 10px;
  }}
  .card .meta strong {{ font-size: 14px; }}
  .badge {{
    padding: 4px 10px; border-radius: 4px; color: white;
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.03em;
  }}
  .badge.openai {{ background: #10A37F; }}
  .badge.gemini {{ background: #4285F4; }}
  .error-card {{
    background: #fff5f5; border: 1px solid #fecaca; border-radius: 12px;
    padding: 40px 20px; text-align: center; color: var(--accent);
    font-size: 14px;
  }}
  .vote-hint {{
    background: white; padding: 20px 24px; border-radius: 8px;
    margin-top: 40px; font-size: 14px; border-left: 4px solid var(--accent);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }}
  .vote-hint strong {{ color: var(--primary); }}
</style>
</head>
<body>
<header>
  <h1>{title}</h1>
  <p class="sub">{subtitle}</p>
  <div class="legend">
    <span>🟢 OpenAI · gpt-image-1.5</span>
    <span>🔵 Gemini · gemini-3.1-flash-image-preview (Nano Banana 2)</span>
    <span>Generated {generated_at}</span>
  </div>
</header>
<main>
"""]

    style_meta = {
        "photorealistic": ("Stil A — Fotorealistisch",
                           "Editorial Photography. Premium-Feel, wie Schweizer Lifestyle-Magazin."),
        "illustration":   ("Stil B — Flat Vector Illustration",
                           "Konsistent mit shadcn/ui Icons. Brand-Farben dominieren."),
        "isometric_3d":   ("Stil C — 3D Isometric",
                           "Modern SaaS-Look, wie Linear / Vercel / Stripe Press."),
    }

    for style_key in styles_order:
        if style_key not in results_by_style:
            continue
        style_label, style_desc = style_meta.get(style_key, (style_key, ""))
        style_results = sorted(results_by_style[style_key], key=lambda x: x["api"])

        parts.append(f'<section class="style-row">\n')
        parts.append(f'  <h2>{style_label} <span class="tag">({style_key})</span></h2>\n')
        parts.append(f'  <p class="style-desc">{style_desc}</p>\n')
        parts.append(f'  <div class="grid">\n')

        for r in style_results:
            api = r["api"]
            label = r["service_label"]
            if r["status"] == "ok":
                img_src = f"{subfolder}/{r['file']}"
                parts.append(
                    f'    <div class="card">\n'
                    f'      <img src="{img_src}" alt="{label} {style_key} {api}" loading="lazy">\n'
                    f'      <div class="meta">\n'
                    f'        <strong>{label}</strong>\n'
                    f'        <span class="badge {api}">{api}</span>\n'
                    f'      </div>\n'
                    f'    </div>\n'
                )
            else:
                err = r.get("error", "Unknown error")
                parts.append(
                    f'    <div class="error-card">\n'
                    f'      <strong>❌ {api} failed</strong><br>{err}\n'
                    f'    </div>\n'
                )

        parts.append(f'  </div>\n')
        parts.append(f'</section>\n')

    parts.append("""
  <div class="vote-hint">
    <strong>Nächster Schritt:</strong> Sag mir welche Kombination gewinnt
    (z.B. „Stil A, OpenAI") — dann generiere ich die restlichen 7 Services
    im gleichen Stil via <code>python generate.py --phase 2 --style &lt;stil&gt; --api &lt;api&gt;</code>.
  </div>
</main>
</body>
</html>
""")

    output_path.write_text("".join(parts), encoding="utf-8")
    print(f"\n✓ Preview HTML: {output_path.absolute()}")


# ---------- Phases ----------

def phase1(config: dict, styles: dict) -> None:
    """Generate Privatumzug x 3 styles x 2 APIs = 6 images."""
    print("=" * 64)
    print("PHASE 1 — Stil-Test (Privatumzug)")
    print("=" * 64)

    service_key = "privatumzug"
    run_dir = PREVIEW_DIR / "phase1-styletest"
    results = []

    for style_key in ["photorealistic", "illustration", "isometric_3d"]:
        for api in ["openai", "gemini"]:
            results.append(generate_image(service_key, style_key, api,
                                          config, styles, run_dir))

    manifest_path = PREVIEW_DIR / "phase1-manifest.json"
    manifest_path.write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    preview_html = PREVIEW_DIR / "preview.html"
    build_preview_html(
        results, preview_html,
        subfolder="phase1-styletest",
        title="Umzugscheck · Service Image · Stil-Vergleich",
        subtitle="Phase 1: Privatumzug in 3 Stilen × 2 APIs. Wähle den Sieger.",
    )

    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"\n{'=' * 64}")
    print(f"✓ Done: {ok}/{len(results)} images generated")
    print(f"→ Open: {preview_html.absolute()}")
    print(f"{'=' * 64}\n")


def phase2(config: dict, styles: dict, style_key: str, api: str) -> None:
    """Generate remaining 7 services in chosen style + api."""
    print("=" * 64)
    print(f"PHASE 2 — Rollout ({style_key} / {api})")
    print("=" * 64)

    all_services = list(config["services"].keys())
    remaining = [s for s in all_services if s != "privatumzug"]
    run_dir = PREVIEW_DIR / f"phase2-{style_key}-{api}"
    results = []

    # Include the phase 1 winner so the preview shows all 8
    privat_src = PREVIEW_DIR / "phase1-styletest" / f"privatumzug_{style_key}_{api}.png"
    if privat_src.exists():
        run_dir.mkdir(parents=True, exist_ok=True)
        dest = run_dir / privat_src.name
        dest.write_bytes(privat_src.read_bytes())
        results.append({
            "service": "privatumzug",
            "service_label": config["services"]["privatumzug"]["label"],
            "style": style_key,
            "style_label": styles[style_key]["label"],
            "api": api,
            "file": privat_src.name,
            "status": "ok",
            "note": "copied from phase 1",
        })
        print(f"\n[privatumzug] copied from phase 1")

    for service_key in remaining:
        results.append(generate_image(service_key, style_key, api,
                                      config, styles, run_dir))

    manifest_path = PREVIEW_DIR / f"phase2-{style_key}-{api}-manifest.json"
    manifest_path.write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    preview_html = PREVIEW_DIR / f"preview-phase2-{style_key}-{api}.html"
    build_preview_html(
        results, preview_html,
        subfolder=f"phase2-{style_key}-{api}",
        title=f"Umzugscheck · Phase 2 · {styles[style_key]['label']} · {api}",
        subtitle="Alle 8 Services im finalen Stil. Nach Freigabe → public/images/services/.",
    )

    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"\n{'=' * 64}")
    print(f"✓ Done: {ok}/{len(results)} images")
    print(f"→ Open: {preview_html.absolute()}")
    print(f"{'=' * 64}\n")


# ---------- Entry point ----------

def main() -> int:
    load_dotenv(SCRIPT_DIR / ".env")

    parser = argparse.ArgumentParser(
        description="Umzugscheck.ch service image generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--phase", type=int, choices=[1, 2],
                        help="1 = style test, 2 = rollout")
    parser.add_argument("--service",
                        help="Single-service mode: service key from config.yaml")
    parser.add_argument("--style",
                        choices=["photorealistic", "illustration", "isometric_3d"],
                        help="Style preset key")
    parser.add_argument("--api", choices=["openai", "gemini"],
                        help="API provider")
    args = parser.parse_args()

    config = load_config()
    styles = load_styles()

    if args.phase == 1:
        phase1(config, styles)
        return 0

    if args.phase == 2:
        if not (args.style and args.api):
            print("ERROR: phase 2 requires --style and --api", file=sys.stderr)
            return 2
        phase2(config, styles, args.style, args.api)
        return 0

    if args.service and args.style and args.api:
        run_dir = PREVIEW_DIR / "single"
        result = generate_image(args.service, args.style, args.api,
                                config, styles, run_dir)
        print("\n" + json.dumps(result, indent=2, ensure_ascii=False))
        return 0 if result["status"] == "ok" else 1

    parser.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
