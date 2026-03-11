
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '电子书阅读器V0.5.9.html');
const htmlContent = fs.readFileSync(inputFile, 'utf8');

console.log(`文件大小: ${htmlContent.length} 字符`);

// 1. 提取CSS
let cssContent = '';
const styleRegex = /&lt;style&gt;([\s\S]*?)&lt;\/style&gt;/g;
let match;
while ((match = styleRegex.exec(htmlContent)) !== null) {
    cssContent += match[1] + '\n';
}

fs.writeFileSync(path.join(__dirname, 'css', 'styles.css'), cssContent, 'utf8');
console.log('CSS文件已保存到 css/styles.css');

// 2. 提取JavaScript
let jsContent = '';
const scriptRegex = /&lt;script&gt;([\s\S]*?)&lt;\/script&gt;/g;
while ((match = scriptRegex.exec(htmlContent)) !== null) {
    // 跳过外部引用的script
    if (!match[0].includes('src=')) {
        jsContent += match[1] + '\n';
    }
}

fs.writeFileSync(path.join(__dirname, 'js', 'full.js'), jsContent, 'utf8');
console.log('完整JavaScript已保存到 js/full.js');

// 3. 创建HTML内容
const headStart = htmlContent.indexOf('&lt;head&gt;');
const headEnd = htmlContent.indexOf('&lt;/head&gt;', headStart);

const newHead = `&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" /&gt;
  &lt;meta name="theme-color" content="#ffffff" /&gt;
  &lt;meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /&gt;
  &lt;meta name="apple-mobile-web-app-capable" content="yes" /&gt;
  &lt;meta name="msapplication-navbutton-color" content="#ffffff" /&gt;
  &lt;title&gt;电子书阅读器V0.5.9&lt;/title&gt;
  &lt;script src="https://cdn.jsdelivr.net/npm/jschardet@3.0.0/dist/jschardet.min.js"&gt;&lt;/script&gt;
  &lt;link rel="stylesheet" href="css/styles.css"&gt;
&lt;/head&gt;`;

const bodyStart = htmlContent.indexOf('&lt;body&gt;');
const bodyEnd = htmlContent.lastIndexOf('&lt;/body&gt;');
let bodyContent = htmlContent.substring(bodyStart + 6, bodyEnd);

// 移除body中的style标签
bodyContent = bodyContent.replace(/&lt;style&gt;[\s\S]*?&lt;\/style&gt;/g, '');
// 移除body中的script标签（保留外部引用）
bodyContent = bodyContent.replace(/&lt;script&gt;[\s\S]*?&lt;\/script&gt;/g, '');

const newHtml = `&lt;!DOCTYPE html&gt;
&lt;html lang="zh"&gt;
${newHead}
&lt;body&gt;
${bodyContent}
  &lt;script src="js/utils.js"&gt;&lt;/script&gt;
  &lt;script src="js/storage.js"&gt;&lt;/script&gt;
  &lt;script src="js/theme.js"&gt;&lt;/script&gt;
  &lt;script src="js/modal.js"&gt;&lt;/script&gt;
  &lt;script src="js/bookshelf.js"&gt;&lt;/script&gt;
  &lt;script src="js/reader.js"&gt;&lt;/script&gt;
  &lt;script src="js/search.js"&gt;&lt;/script&gt;
  &lt;script src="js/main.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;`;

fs.writeFileSync(path.join(__dirname, 'index.html'), newHtml, 'utf8');
console.log('主HTML文件已保存到 index.html');

console.log('\n文件拆分完成！');
