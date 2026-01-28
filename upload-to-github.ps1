# GitHub 上传脚本
# 使用方法：在 PowerShell 中执行此脚本，然后按照提示操作

Write-Host "=== GitHub 上传脚本 ===" -ForegroundColor Green
Write-Host ""

# 检查是否在正确的目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir" -ForegroundColor Yellow

# 初始化 Git（如果还没有）
if (-not (Test-Path .git)) {
    Write-Host "初始化 Git 仓库..." -ForegroundColor Cyan
    git init
} else {
    Write-Host "Git 仓库已存在" -ForegroundColor Green
}

# 添加所有文件
Write-Host "添加文件到暂存区..." -ForegroundColor Cyan
git add .

# 显示状态
Write-Host ""
Write-Host "文件状态:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "=== 下一步操作 ===" -ForegroundColor Green
Write-Host "1. 提交文件: git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "2. 添加远程仓库: git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor White
Write-Host "3. 推送到 GitHub: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "提示：将 YOUR_USERNAME 和 REPO_NAME 替换为你的 GitHub 用户名和仓库名" -ForegroundColor Yellow
