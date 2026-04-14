#!/usr/bin/env python3
"""Compress splash art to JPEG and convert to base64 data URIs"""
import os
import base64
import json

try:
    from PIL import Image
    import io
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("WARNING: PIL not available, will use raw files")

splash_dir = 'splash-art'
output = {}

TARGET_WIDTH = 600  # Good quality for background use
JPEG_QUALITY = 72   # Balance between quality and size

for fname in sorted(os.listdir(splash_dir)):
    if not fname.endswith(('.webp', '.png', '.jpg')):
        continue
    code = fname.rsplit('.', 1)[0].upper()
    fpath = os.path.join(splash_dir, fname)
    
    if HAS_PIL:
        try:
            img = Image.open(fpath)
            # Convert to RGB (remove alpha for JPEG)
            if img.mode in ('RGBA', 'P', 'LA'):
                bg = Image.new('RGB', img.size, (11, 16, 38))  # bg-deep color
                if img.mode == 'P':
                    img = img.convert('RGBA')
                bg.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
                img = bg
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize proportionally
            w, h = img.size
            if w > TARGET_WIDTH:
                ratio = TARGET_WIDTH / w
                new_h = int(h * ratio)
                img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
            
            # Save as JPEG
            buf = io.BytesIO()
            img.save(buf, format='JPEG', quality=JPEG_QUALITY, optimize=True)
            data = buf.getvalue()
            b64 = base64.b64encode(data).decode('ascii')
            output[code] = f'data:image/jpeg;base64,{b64}'
            print(f"[OK] {code}: {len(data)//1024}KB (JPEG {img.size[0]}x{img.size[1]})")
        except Exception as e:
            print(f"[ERR] {code}: {e}")
    else:
        with open(fpath, 'rb') as f:
            data = f.read()
        b64 = base64.b64encode(data).decode('ascii')
        ext = fname.rsplit('.', 1)[1]
        mime = {'webp': 'image/webp', 'png': 'image/png', 'jpg': 'image/jpeg'}.get(ext, 'image/webp')
        output[code] = f'data:{mime};base64,{b64}'
        print(f"[OK] {code}: {len(data)//1024}KB (raw {ext})")

# For PAIMON fallback, use traveler-anemo icon from existing portraits
paimon_portrait = 'portraits/paimon.webp'
if not os.path.exists(paimon_portrait):
    paimon_portrait = 'portraits/traveler-anemo.webp'
if os.path.exists(paimon_portrait) and HAS_PIL:
    try:
        img = Image.open(paimon_portrait)
        if img.mode in ('RGBA', 'P', 'LA'):
            bg = Image.new('RGB', img.size, (11, 16, 38))
            if img.mode == 'P':
                img = img.convert('RGBA')
            bg.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
            img = bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        w, h = img.size
        if w > TARGET_WIDTH:
            ratio = TARGET_WIDTH / w
            img = img.resize((TARGET_WIDTH, int(h * ratio)), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=JPEG_QUALITY, optimize=True)
        data = buf.getvalue()
        b64 = base64.b64encode(data).decode('ascii')
        output['PAIMON'] = f'data:image/jpeg;base64,{b64}'
        print(f"[OK] PAIMON (fallback): {len(data)//1024}KB")
    except Exception as e:
        print(f"[ERR] PAIMON fallback: {e}")

with open('splash_b64.json', 'w') as f:
    json.dump(output, f)

print(f"\nTotal: {len(output)} characters")
total_kb = sum(len(v) for v in output.values()) // 1024
print(f"Total base64 size: {total_kb}KB")
