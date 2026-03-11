
$ErrorActionPreference = "Stop"

$sourceFile = Join-Path $PSScriptRoot "电子书阅读器V0.5.9.html"
$cssFile = Join-Path $PSScriptRoot "css" "styles.css"
$jsFile = Join-Path $PSScriptRoot "js" "full.js"

Write-Host "Reading source file..."
$content = [System.IO.File]::ReadAllText($sourceFile, [System.Text.UTF8Encoding]::UTF8)

Write-Host "Extracting CSS..."
$cssContent = ""
$pattern = [regex]::new('&lt;style&gt;([\s\S]*?)&lt;/style&gt;')
$matches = $pattern.Matches($content)
foreach ($m in $matches) {
    $cssContent += $m.Groups[1].Value + "`n`n"
}
[System.IO.File]::WriteAllText($cssFile, $cssContent, [System.Text.UTF8Encoding]::UTF8)
Write-Host "CSS saved to: $cssFile"

Write-Host "Extracting JavaScript..."
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
Write-Host "JavaScript saved to: $jsFile"

Write-Host "`nExtraction complete!"
Write-Host "CSS size: $($cssContent.Length) chars"
Write-Host "JS size: $($jsContent.Length) chars"
