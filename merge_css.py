#!/usr/bin/env python3
"""Merge new result CSS section into global.css"""
import re

with open('src/styles/global.css', 'r') as f:
    css = f.read()

with open('result_css_section.css', 'r') as f:
    new_result_css = f.read()

# Find the ResultScreen section and replace it
# The section starts with the ResultScreen comment and ends before the Responsive comment
# Looking at the CSS, the ResultScreen section starts at "/* ResultScreen */" or the .result class
# and ends before "/* Responsive */"

# Let's find the boundaries
# Pattern: from ".result {" to just before "@media"
start_marker = '/* ============================================\n   ResultScreen\n   ============================================ */'
end_marker = '/* ============================================\n   Responsive\n   ============================================ */'

start_idx = css.find(start_marker)
end_idx = css.find(end_marker)

if start_idx == -1:
    # Try alternative markers
    start_idx = css.find('.result {')
    if start_idx == -1:
        start_idx = css.find('.result{')
    # Go back to find the comment before it
    comment_start = css.rfind('/*', 0, start_idx)
    if comment_start != -1 and start_idx - comment_start < 200:
        start_idx = comment_start

if end_idx == -1:
    end_idx = css.find('@media (max-width')
    if end_idx == -1:
        end_idx = css.find('@media(max-width')

if start_idx == -1 or end_idx == -1:
    print(f"Could not find boundaries: start={start_idx}, end={end_idx}")
    # Just append
    new_css = css + '\n\n' + new_result_css
else:
    print(f"Found ResultScreen section at [{start_idx}:{end_idx}]")
    new_css = css[:start_idx] + new_result_css + '\n\n' + css[end_idx:]

with open('src/styles/global.css', 'w') as f:
    f.write(new_css)

print(f"CSS merged. New size: {len(new_css)} bytes")
