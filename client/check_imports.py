import os
import re

def check_file(base_path, import_path):
    # Handle aliases
    if import_path.startswith('@/'):
        target = os.path.join(os.getcwd(), 'src', import_path[2:])
    elif import_path.startswith('./') or import_path.startswith('../'):
        target = os.path.join(os.path.dirname(base_path), import_path)
    else:
        return True # node module
        
    target = os.path.normpath(target)
    
    # Try different extensions if no extension provided
    extensions = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx']
    
    for ext in extensions:
        if os.path.isfile(target + ext):
            # On macOS, filesystems are case-insensitive by default.
            # We must check if the exact case matches what's in the directory.
            dir_name = os.path.dirname(target + ext)
            base_name = os.path.basename(target + ext)
            if base_name in os.listdir(dir_name):
                return True
                
    return False

errors = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r') as f:
                content = f.read()
            # find all imports
            imports = re.findall(r'import\s+.*from\s+[\'"]([^\'"]+)[\'"]', content)
            for imp in imports:
                if not check_file(file_path, imp):
                    errors.append(f"{file_path}: Broken import -> {imp}")

if errors:
    print("\n".join(errors))
else:
    print("All imports valid!")
