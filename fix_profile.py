#!/usr/bin/env python3
"""Fix profile.html by inlining bundle.js"""

# Read bundle.js
with open('js/bundle.js', 'r', encoding='utf-8') as f:
    bundle_js = f.read()

# Read profile.html
with open('profile.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the bundle.js reference with inline content
content = content.replace(
    '<script src="js/bundle.js"></script>',
    f'<script>\n{bundle_js}\n</script>'
)

# Write back
with open('profile.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ Fixed profile.html - bundle.js is now inlined')
