#!/usr/bin/env python3
"""
Inject HD splash base64 from wiki_splash_b64.json into characters.ts
"""
import json, re, os

script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, 'wiki_splash_b64.json')
ts_path = os.path.join(script_dir, 'src', 'data', 'characters.ts')

with open(json_path) as f:
    splash_map = json.load(f)

with open(ts_path, 'r') as f:
    ts_content = f.read()

count = 0
for code, data_uri in splash_map.items():
    # Match: splash: 'data:image/jpeg;base64,...' or splash: "data:image/jpeg;base64,..."
    # Replace the data URI content
    pattern = rf"(code:\s*'{code}'.*?splash:\s*')[^']*(')"
    def replacer(m):
        return m.group(1) + data_uri + m.group(2)
    new_content, n = re.subn(pattern, replacer, ts_content, count=1, flags=re.DOTALL)
    if n > 0:
        ts_content = new_content
        count += 1
        print(f"  Updated {code} splash ({len(data_uri)//1024}KB)")
    else:
        print(f"  [WARN] Could not find splash field for {code}")

with open(ts_path, 'w') as f:
    f.write(ts_content)

print(f"\nUpdated {count}/32 characters in characters.ts")
print(f"File size: {os.path.getsize(ts_path) / 1024 / 1024:.2f} MB")
