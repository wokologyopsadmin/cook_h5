#!/usr/bin/env python3
"""
Inline JavaScript into HTML files for Firefox file:// protocol compatibility
"""

import os
import re

# Read the bundled JavaScript
with open('js/bundle.js', 'r', encoding='utf-8') as f:
    bundle_js = f.read()

# Find all HTML files
html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for html_file in html_files:
    print(f'Processing {html_file}...')
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if it has the external script references
    if '<script src="js/i18n.js"></script>' in content and '<script src="js/app.js"></script>' in content:
        # Replace the two script tags with inline bundle
        content = re.sub(
            r'<script src="js/i18n\.js"></script>\s*<script src="js/app\.js"></script>',
            f'<script>\n{bundle_js}\n</script>',
            content
        )
        
        # Write back
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'  ✓ Updated {html_file}')
    else:
        print(f'  - Skipped {html_file} (no external JS references found)')

print('\n✅ Done! All HTML files updated for Firefox compatibility.')
print('You can now open any HTML file directly in Firefox using file:// protocol.')
