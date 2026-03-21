import os, re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

pages = [
    'index', 'dashboard', 'recipes', 'recipe-detail', 'machines',
    'machine-detail', 'stores', 'store-managers', 'profile', 'settings',
    'publish', 'register', 'email-verify', 'about', 'help'
]

page_pattern = '|'.join(pages)

def replace_html_ext(content):
    # href="page.html"  -> href="page"
    content = re.sub(r'(href=["\'])(' + page_pattern + r')\.html(["\'])', r'\1\2\3', content)
    # location.href = 'page.html'  -> location.href = 'page'
    content = re.sub(r"(location\.href\s*=\s*['\"])(" + page_pattern + r")\.html(['\"])", r'\1\2\3', content)
    return content

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        original = f.read()
    updated = replace_html_ext(original)
    if updated != original:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(updated)
        print("changed: " + fname)
    else:
        print("no change: " + fname)
