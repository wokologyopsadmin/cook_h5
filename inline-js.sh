#!/bin/bash
# Script to inline JavaScript into HTML files for Firefox compatibility

# Read the JS content
I18N_JS=$(cat js/i18n.js)
APP_JS=$(cat js/app.js)

# Function to inline JS in HTML files
inline_js() {
    local file=$1
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Replace the script tags with inline content
    sed -i '' '/<script src="js\/i18n.js"><\/script>/d' "$file"
    sed -i '' '/<script src="js\/app.js"><\/script>/d' "$file"
    
    # Find the last <script> tag and insert before it
    # This is a simple approach - insert before </body>
    awk -v i18n="$I18N_JS" -v app="$APP_JS" '
    /<\/body>/ {
        print "<script>"
        print i18n
        print "</script>"
        print "<script>"
        print app
        print "</script>"
    }
    { print }
    ' "$file.bak" > "$file"
    
    echo "Processed: $file"
}

# Process all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        inline_js "$file"
    fi
done

echo "Done! All HTML files have been updated for Firefox compatibility."
echo "Backup files created with .bak extension"
