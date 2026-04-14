#!/usr/bin/env python3
"""
Download ORIGINAL resolution gacha splash art from Genshin Impact Fandom Wiki.
No resize — uses the full original image.
Compresses to JPEG quality 85 with dark background for transparency.
Outputs base64 data URIs to wiki_splash_b64.json.
"""
import urllib.request
import json
import base64
import io
import os
import time
import sys

from PIL import Image

WIKI_NAME_MAP = {
    'ZHONGLI': 'Zhongli',
    'HUTAO': 'Hu_Tao',
    'KEQING': 'Keqing',
    'VENTI': 'Venti',
    'GANYU': 'Ganyu',
    'XIAO': 'Xiao',
    'NAHIDA': 'Nahida',
    'TARTAGLIA': 'Tartaglia',
    'AYAKA': 'Kamisato_Ayaka',
    'KLEE': 'Klee',
    'RAIDEN': 'Raiden_Shogun',
    'WANDERER': 'Wanderer',
    'QIQI': 'Qiqi',
    'FURINA': 'Furina',
    'ZHONGLI_BROKE': 'Zhongli',
    'DILUC': 'Diluc',
    'JEAN': 'Jean',
    'ALBEDO': 'Albedo',
    'BENNETT': 'Bennett',
    'FISCHL': 'Fischl',
    'KAZUHA': 'Kaedehara_Kazuha',
    'YOIMIYA': 'Yoimiya',
    'EULA': 'Eula',
    'ALHAITHAM': 'Alhaitham',
    'CYNO': 'Cyno',
    'KOKOMI': 'Sangonomiya_Kokomi',
    'YELAN': 'Yelan',
    'SHENHE': 'Shenhe',
    'NEUVILLETTE': 'Neuvillette',
    'NAVIA': 'Navia',
    'ITTO': 'Arataki_Itto',
}

DARK_BG = (11, 16, 38)
JPEG_QUALITY = 85
USER_AGENT = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/120.0.0.0 Safari/537.36'
)
WIKI_DOMAINS = [
    'genshin-impact.fandom.com',
    'gensin-impact.fandom.com',
]
CACHE_DIR = os.path.join(os.path.dirname(__file__) or '.', '_wiki_cache')
os.makedirs(CACHE_DIR, exist_ok=True)


def _url_open(url: str, retries: int = 3, timeout: int = 60) -> bytes:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
            resp = urllib.request.urlopen(req, timeout=timeout)
            return resp.read()
        except Exception as exc:
            if attempt == retries - 1:
                raise
            print(f"  retry {attempt+1}/{retries}: {exc}")
            time.sleep(2 * (attempt + 1))


def query_image_url(wiki_name: str) -> tuple[str | None, int, int]:
    """Returns (url, width, height) for the ORIGINAL image — no resize suffix."""
    file_title = f"File:Character_{wiki_name}_Full_Wish.png"
    for domain in WIKI_DOMAINS:
        api_url = (
            f"https://{domain}/api.php?"
            f"action=query&titles={file_title}"
            f"&prop=imageinfo&iiprop=url|size|mime&format=json"
        )
        try:
            data = _url_open(api_url)
            j = json.loads(data)
            pages = j.get('query', {}).get('pages', {})
            for page_id, page in pages.items():
                if page_id == '-1':
                    continue
                ii = page.get('imageinfo', [{}])[0]
                raw_url = ii.get('url')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if raw_url:
                    # Use /revision/latest for the full original
                    return raw_url, w, h
        except Exception as exc:
            print(f"  API failed on {domain}: {exc}")
    return None, 0, 0


def download_image(code: str, wiki_name: str) -> bytes | None:
    cache_path = os.path.join(CACHE_DIR, f"{code}.png")
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 10000:
        print(f"  [cache hit] {code}")
        with open(cache_path, 'rb') as f:
            return f.read()

    url, orig_w, orig_h = query_image_url(wiki_name)
    if not url:
        print(f"  [WARN] No URL for {code}")
        return None

    print(f"  downloading original {orig_w}x{orig_h} ...")
    print(f"  {url[:120]}...")
    raw = _url_open(url)
    if raw and len(raw) > 10000:
        with open(cache_path, 'wb') as f:
            f.write(raw)
        return raw
    print(f"  [WARN] Image too small ({len(raw)} bytes)")
    return None


def compress_to_jpeg(raw: bytes) -> tuple[bytes, tuple[int, int]]:
    img = Image.open(io.BytesIO(raw))

    # Flatten transparency onto dark background
    if img.mode in ('RGBA', 'PA', 'LA'):
        bg = Image.new('RGB', img.size, DARK_BG)
        if img.mode in ('PA', 'LA'):
            img = img.convert('RGBA')
        bg.paste(img, mask=img.split()[-1])
        img = bg
    elif img.mode == 'P':
        img = img.convert('RGBA')
        bg = Image.new('RGB', img.size, DARK_BG)
        bg.paste(img, mask=img.split()[-1])
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # NO resize — keep original dimensions

    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=JPEG_QUALITY, optimize=True)
    return buf.getvalue(), img.size


def main():
    output: dict[str, str] = {}
    sizes: dict[str, int] = {}
    failed: list[str] = []

    for code, wiki_name in WIKI_NAME_MAP.items():
        print(f"[{code}]")
        raw = download_image(code, wiki_name)
        if raw is None:
            failed.append(code)
            continue
        try:
            jpeg_data, dim = compress_to_jpeg(raw)
        except Exception as exc:
            print(f"  [ERR] compression failed: {exc}")
            failed.append(code)
            continue
        b64 = base64.b64encode(jpeg_data).decode('ascii')
        data_uri = f"data:image/jpeg;base64,{b64}"
        output[code] = data_uri
        sizes[code] = len(jpeg_data)
        print(f"  -> {dim[0]}x{dim[1]}, {len(jpeg_data)//1024}KB JPEG, "
              f"{len(data_uri)//1024}KB b64")

    # PAIMON: local portrait
    print("[PAIMON]")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    paimon_paths = [
        os.path.join(script_dir, 'portraits', 'PAIMON.png'),
        os.path.join(script_dir, 'splash-art', 'paimon.webp'),
    ]
    paimon_raw = None
    for p in paimon_paths:
        if os.path.exists(p) and os.path.getsize(p) > 500:
            print(f"  using {p}")
            with open(p, 'rb') as f:
                paimon_raw = f.read()
            break
    if paimon_raw:
        jpeg_data, dim = compress_to_jpeg(paimon_raw)
        b64 = base64.b64encode(jpeg_data).decode('ascii')
        data_uri = f"data:image/jpeg;base64,{b64}"
        output['PAIMON'] = data_uri
        sizes['PAIMON'] = len(jpeg_data)
        print(f"  -> {dim[0]}x{dim[1]}, {len(jpeg_data)//1024}KB JPEG")
    else:
        print("  [WARN] No PAIMON image found!")
        failed.append('PAIMON')

    out_path = os.path.join(script_dir, 'wiki_splash_b64.json')
    with open(out_path, 'w') as f:
        json.dump(output, f)
    total_json_bytes = os.path.getsize(out_path)

    print("\n" + "=" * 60)
    print(f"Characters processed: {len(output)}/32")
    print(f"Total JSON size: {total_json_bytes / 1024 / 1024:.2f} MB")
    print()
    print(f"{'Code':<20} {'JPEG KB':>8} {'B64 KB':>10}")
    print("-" * 42)
    total_jpeg = 0
    for code in sorted(sizes):
        jpeg_kb = sizes[code] / 1024
        uri_kb = len(output[code]) / 1024
        total_jpeg += sizes[code]
        print(f"{code:<20} {jpeg_kb:>8.1f} {uri_kb:>10.1f}")
    print("-" * 42)
    print(f"{'TOTAL':<20} {total_jpeg/1024:>8.1f} {total_json_bytes/1024:>10.1f}")

    if failed:
        print(f"\nFAILED ({len(failed)}): {', '.join(failed)}")
        sys.exit(1)
    else:
        print("\nAll 32 characters OK!")


if __name__ == '__main__':
    main()
