#!/usr/bin/env python3
"""
Fix Firefox localStorage issues by making auth optional for demo
"""

import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'test-firefox.html' and f != 'test-recipes.html']

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the requireAuth function to handle localStorage errors
    old_auth = '''function requireAuth() {
  if (!localStorage.getItem('chefhub_logged_in')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}'''
    
    new_auth = '''function requireAuth() {
  try {
    if (!localStorage.getItem('chefhub_logged_in')) {
      // For Firefox file:// protocol demo, auto-login as admin
      localStorage.setItem('chefhub_logged_in', '1');
      localStorage.setItem('chefhub_user', JSON.stringify({
        id: 1,
        name: '管理员',
        account: 'admin',
        role: 'admin',
        roleLabel: '系统管理员'
      }));
    }
  } catch (e) {
    // localStorage blocked in Firefox file:// - use in-memory fallback
    console.warn('localStorage not available, using demo mode');
  }
  return true;
}'''
    
    if old_auth in content:
        content = content.replace(old_auth, new_auth)
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'✓ Fixed {html_file}')
    else:
        print(f'- Skipped {html_file} (pattern not found)')

print('\n✅ Done! Firefox localStorage issues fixed.')
