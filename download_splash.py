#!/usr/bin/env python3
"""Download gacha-splash art for all characters from genshin.jmp.blue"""
import urllib.request
import os
import json
import time

# Map character codes to API slugs (lowercase with hyphens)
SLUG_MAP = {
    'ZHONGLI': ['zhongli'],
    'HUTAO': ['hu-tao'],
    'KEQING': ['keqing'],
    'VENTI': ['venti'],
    'GANYU': ['ganyu'],
    'XIAO': ['xiao'],
    'NAHIDA': ['nahida'],
    'TARTAGLIA': ['tartaglia', 'childe'],
    'AYAKA': ['ayaka', 'kamisato-ayaka'],
    'KLEE': ['klee'],
    'RAIDEN': ['raiden', 'raiden-shogun'],
    'WANDERER': ['wanderer', 'scaramouche'],
    'QIQI': ['qiqi'],
    'FURINA': ['furina'],
    'ZHONGLI_BROKE': ['zhongli'],  # same character, different personality
    'DILUC': ['diluc'],
    'JEAN': ['jean'],
    'ALBEDO': ['albedo'],
    'BENNETT': ['bennett'],
    'FISCHL': ['fischl'],
    'KAZUHA': ['kazuha', 'kaedehara-kazuha'],
    'YOIMIYA': ['yoimiya'],
    'EULA': ['eula'],
    'ALHAITHAM': ['alhaitham'],
    'CYNO': ['cyno'],
    'KOKOMI': ['kokomi', 'sangonomiya-kokomi'],
    'YELAN': ['yelan'],
    'SHENHE': ['shenhe'],
    'NEUVILLETTE': ['neuvillette'],
    'NAVIA': ['navia'],
    'ITTO': ['itto', 'arataki-itto'],
    'PAIMON': ['paimon'],
}

splash_dir = 'splash-art'
os.makedirs(splash_dir, exist_ok=True)

results = {}
failed = []

for code, slugs in SLUG_MAP.items():
    out_path = os.path.join(splash_dir, f'{code.lower()}.webp')
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        print(f"[SKIP] {code} already exists")
        results[code] = out_path
        continue
    
    success = False
    for slug in slugs:
        # Try gacha-splash first, then portrait
        for endpoint in ['gacha-splash', 'portrait']:
            url = f'https://genshin.jmp.blue/characters/{slug}/{endpoint}'
            print(f"[TRY] {code} -> {url}")
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                resp = urllib.request.urlopen(req, timeout=30)
                data = resp.read()
                if len(data) > 5000:  # valid image
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    print(f"[OK] {code} ({len(data)} bytes from {endpoint})")
                    results[code] = out_path
                    success = True
                    break
                else:
                    print(f"[SMALL] {code} - only {len(data)} bytes")
            except Exception as e:
                print(f"[FAIL] {code}/{slug}/{endpoint}: {e}")
            time.sleep(0.3)
        if success:
            break
    
    if not success:
        failed.append(code)
        print(f"[FAILED] {code}")
    
    time.sleep(0.2)

print(f"\n=== Results ===")
print(f"Success: {len(results)}/{len(SLUG_MAP)}")
print(f"Failed: {failed}")

# Save results
with open('splash_results.json', 'w') as f:
    json.dump({'success': results, 'failed': failed}, f, indent=2)
