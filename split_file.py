
import re
import os

source_file = r'd:\Code\Trae\阅读器\电子书阅读器V0.5.9.html'
output_dir = r'd:\Code\Trae\阅读器'

# 确保文件夹存在
css_dir = os.path.join(output_dir, 'css')
js_dir = os.path.join(output_dir, 'js')
os.makedirs(css_dir, exist_ok=True)
os.makedirs(js_dir, exist_ok=True)

print('开始读取源文件...')
with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()
print('源文件读取完成')

# 提取CSS
print('正在提取CSS...')
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    css_content = style_match.group(1).strip()
    css_path = os.path.join(output_dir, 'css', 'styles.css')
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print(f'CSS已提取到: {css_path}')

# 提取所有script标签的内容
print('正在提取JavaScript...')
scripts = []
script_matches = list(re.finditer(r'<script[^>]*>(.*?)</script>', content, re.DOTALL))
print(f'找到 {len(script_matches)} 个script标签')
for i, match in enumerate(script_matches):
    script_content = match.group(1).strip()
    has_src = 'src=' in match.group(0)
    if script_content and not has_src:
        scripts.append(script_content)

print(f'收集到 {len(scripts)} 个内联脚本')
if scripts:
    js_content = '\n\n// === NEXT SCRIPT ===\n\n'.join(scripts)
    js_path = os.path.join(output_dir, 'js', 'main.js')
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f'JavaScript已提取到: {js_path}')
else:
    print('警告：没有找到任何内联JavaScript！')

# 创建主HTML文件
print('正在创建主HTML...')
html_content = content
# 移除内联CSS
if style_match:
    html_content = html_content.replace(style_match.group(0), '<link rel="stylesheet" href="css/styles.css">')
# 移除内联script（保留带src的）
for match in script_matches:
    if 'src=' not in match.group(0):
        html_content = html_content.replace(match.group(0), '')
# 添加新的script标签
if '</body>' in html_content:
    html_content = html_content.replace('</body>', '    <script src="js/main.js"></script>\n</body>')

index_path = os.path.join(output_dir, 'index.html')
with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html_content)
print(f'主HTML已创建: {index_path}')
print('文件拆分完成！')
