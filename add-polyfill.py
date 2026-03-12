#!/usr/bin/env python3
"""
Add localStorage polyfill to all HTML files for Firefox compatibility.
The polyfill must be loaded BEFORE any other scripts.
"""

import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

polyfill_script = '<script src="js/localStorage-polyfill.js"></script>'

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has the polyfill
    if 'localStorage-polyfill.js' in content:
        print(f'- Skipped {html_file} (already has polyfill)')
        continue
    
    # Find the position: right after <head> or before the first <script>
    # Method 1: Insert after <head> tag
    head_match = re.search(r'<head[^>]*>', content, re.IGNORECASE)
    
    if head_match:
        insert_pos = head_match.end()
        # Insert with newline
        new_content = content[:insert_pos] + '\n  ' + polyfill_script + content[insert_pos:]
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'✓ Added polyfill to {html_file}')
    else:
        print(f'✗ No <head> tag found in {html_file}')

print('\n✅ Done! localStorage polyfill added to all HTML files.')
print('\nNow Firefox file:// protocol will use memory storage instead of throwing errors.')
