
# 电子书阅读器文件拆分脚本
# 读取完整文件
$htmlContent = Get-Content "d:\Code\Trae\阅读器\电子书阅读器V0.5.9.html" -Raw

Write-Host "文件大小: $($htmlContent.Length) 字符"

# 1. 提取CSS - 找到第一个和最后一个style标签
$styleTagPattern = [regex]::new('&lt;style&gt;(.*?)&lt;/style&gt;', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$styleMatches = $styleTagPattern.Matches($htmlContent)

Write-Host "找到 $($styleMatches.Count) 个style标签"

# 合并所有CSS内容
$allCss = ""
foreach ($match in $styleMatches) {
    $allCss += $match.Groups[1].Value + "`n"
}

# 保存CSS文件
$allCss | Out-File -FilePath "d:\Code\Trae\阅读器\css\styles.css" -Encoding UTF8
Write-Host "CSS文件已保存到 css/styles.css"

# 2. 提取HTML主体内容 - 去掉style标签和script标签
# 先处理body标签部分
$bodyStart = $htmlContent.IndexOf('&lt;body&gt;') + 6
$bodyEnd = $htmlContent.LastIndexOf('&lt;/body&gt;')
$bodyContent = $htmlContent.Substring($bodyStart, $bodyEnd - $bodyStart)

# 去掉内嵌style标签
$bodyContentClean = [regex]::Replace($bodyContent, '&lt;style&gt;.*?&lt;/style&gt;', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
# 去掉内嵌script标签（保留外部引用）
$bodyContentClean = [regex]::Replace($bodyContentClean, '&lt;script&gt;.*?&lt;/script&gt;', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

# 3. 创建主HTML文件
$htmlTemplate = @"
&lt;!DOCTYPE html&gt;
&lt;html lang="zh"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" /&gt;
  &lt;meta name="theme-color" content="#ffffff" /&gt;
  &lt;meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /&gt;
  &lt;meta name="apple-mobile-web-app-capable" content="yes" /&gt;
  &lt;meta name="msapplication-navbutton-color" content="#ffffff" /&gt;
  &lt;title&gt;电子书阅读器V0.5.9&lt;/title&gt;
  &lt;script src="https://cdn.jsdelivr.net/npm/jschardet@3.0.0/dist/jschardet.min.js"&gt;&lt;/script&gt;
  &lt;link rel="stylesheet" href="css/styles.css"&gt;
&lt;/head&gt;
&lt;body&gt;
$bodyContentClean
  &lt;script src="js/utils.js"&gt;&lt;/script&gt;
  &lt;script src="js/storage.js"&gt;&lt;/script&gt;
  &lt;script src="js/theme.js"&gt;&lt;/script&gt;
  &lt;script src="js/modal.js"&gt;&lt;/script&gt;
  &lt;script src="js/bookshelf.js"&gt;&lt;/script&gt;
  &lt;script src="js/reader.js"&gt;&lt;/script&gt;
  &lt;script src="js/search.js"&gt;&lt;/script&gt;
  &lt;script src="js/main.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
"@

$htmlTemplate | Out-File -FilePath "d:\Code\Trae\阅读器\index.html" -Encoding UTF8
Write-Host "主HTML文件已保存到 index.html"

# 4. 提取JavaScript代码
$scriptTagPattern = [regex]::new('&lt;script&gt;(.*?)&lt;/script&gt;', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$scriptMatches = $scriptTagPattern.Matches($htmlContent)

Write-Host "找到 $($scriptMatches.Count) 个script标签"

# 合并所有JavaScript内容（跳过外部引用的）
$allJs = ""
foreach ($match in $scriptMatches) {
    $scriptContent = $match.Groups[1].Value
    if (-not $scriptContent.Contains('src=')) {
        $allJs += $scriptContent + "`n"
    }
}

# 保存完整JavaScript到临时文件，之后我们会手动拆分
$allJs | Out-File -FilePath "d:\Code\Trae\阅读器\js\full.js" -Encoding UTF8
Write-Host "完整JavaScript已保存到 js/full.js (后续会拆分)"

Write-Host "`n文件拆分完成！"
Write-Host "请查看生成的文件："
Write-Host "  - index.html (主页面)"
Write-Host "  - css/styles.css (样式文件)"
Write-Host "  - js/full.js (完整JavaScript，需要拆分)"
