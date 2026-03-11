
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

# 第一步：移除所有的style标签
html_content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)

# 第二步：移除所有内联的script标签（保留带src的）
all_script_tags = list(re.finditer(r'<script[^>]*>.*?</script>', html_content, re.DOTALL))
for match in reversed(all_script_tags):  # 从后往前替换，避免索引问题
    if 'src=' not in match.group(0):
        html_content = html_content[:match.start()] + html_content[match.end():]

# 第三步：在head中添加CSS链接
head_end_pos = html_content.find('</head>')
if head_end_pos != -1:
    html_content = html_content[:head_end_pos] + '\n  <link rel="stylesheet" href="css/styles.css">\n' + html_content[head_end_pos:]

# 第四步：在body结束前添加JavaScript引用
body_end_pos = html_content.find('</body>')
if body_end_pos != -1:
    html_content = html_content[:body_end_pos] + '\n    <script src="js/main.js"></script>\n' + html_content[body_end_pos:]

# 第五步：清理重复的noteSplitScreen元素（原文件有两个）
# 找到第一个noteSplitScreen的结束位置
first_note_start = html_content.find('<!-- 笔记编辑分屏区域 -->')
if first_note_start != -1:
    # 找到第一个</div>（对应noteSplitScreen的结束）之后的位置
    # 找到第二个noteSplitScreen的开始
    second_note_start = html_content.find('<!-- 笔记编辑分屏区域 -->', first_note_start + 1)
    if second_note_start != -1:
        # 找到第二个noteSplitScreen的结束
        # 查找从second_note_start开始的</div>，并统计层级
        div_count = 0
        pos = second_note_start
        while pos < len(html_content):
            open_div = html_content.find('<div', pos)
            close_div = html_content.find('</div>', pos)
            
            if close_div == -1:
                break
                
            if open_div != -1 and open_div < close_div:
                div_count += 1
                pos = open_div + 4
            else:
                div_count -= 1
                pos = close_div + 6
                if div_count == 0:
                    # 找到第二个noteSplitScreen的结束位置，删除它
                    html_content = html_content[:second_note_start] + html_content[pos:]
                    break

index_path = os.path.join(output_dir, 'index.html')
with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html_content)
print(f'主HTML已创建: {index_path}')
print('文件拆分完成！')

