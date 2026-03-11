
$ErrorActionPreference = "Stop"

$sourceFile = Join-Path $PSScriptRoot "电子书阅读器V0.5.9.html"
$cssFile = Join-Path $PSScriptRoot "css" "styles.css"
$jsFile = Join-Path $PSScriptRoot "js" "full.js"

Write-Host "读取源文件..."
$content = [System.IO.File]::ReadAllText($sourceFile, [System.Text.UTF8Encoding]::UTF8)

# 提取CSS - 找到所有style标签内容
Write-Host "提取CSS..."
$cssContent = ""
$pattern = [regex]::new('&lt;style&gt;([\s\S]*?)&lt;/style&gt;')
$matches = $pattern.Matches($content)
foreach ($m in $matches) {
    $cssContent += $m.Groups[1].Value + "`n`n"
}
[System.IO.File]::WriteAllText($cssFile, $cssContent, [System.Text.UTF8Encoding]::UTF8)
Write-Host "CSS已保存到: $cssFile"

# 提取JavaScript - 找到所有非外部引用的script标签
Write-Host "提取JavaScript..."
$jsContent = ""
$jsPattern = [regex]::new('&lt;script&gt;([\s\S]*?)&lt;/script&gt;')
$jsMatches = $jsPattern.Matches($content)
foreach ($m in $jsMatches) {
    $s = $m.Value
    if (-not $s.Contains('src=')) {
        $jsContent += $m.Groups[1].Value + "`n`n"
    }
}
[System.IO.File]::WriteAllText($jsFile, $jsContent, [System.Text.UTF8Encoding]::UTF8)
Write-Host "JavaScript已保存到: $jsFile"

Write-Host "`n提取完成！"
Write-Host "CSS大小: $($cssContent.Length) 字符"
Write-Host "JS大小: $($jsContent.Length) 字符"
