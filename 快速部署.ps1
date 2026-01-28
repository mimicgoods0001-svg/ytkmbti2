# ytkMBTI 快速部署脚本
# 使用方法：在 PowerShell 中运行 .\快速部署.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ytkMBTI 项目快速部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "package.json")) {
    Write-Host "错误：请在项目根目录运行此脚本！" -ForegroundColor Red
    exit 1
}

# 检查 Git 是否安装
try {
    $gitVersion = git --version
    Write-Host "✓ Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git 未安装，请先安装 Git" -ForegroundColor Red
    Write-Host "  下载地址: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "步骤 1: 检查 Git 状态..." -ForegroundColor Yellow
git status

Write-Host ""
$continue = Read-Host "是否继续部署？(Y/N)"
if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Host "已取消部署" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "步骤 2: 添加所有文件..." -ForegroundColor Yellow
git add .

Write-Host ""
$commitMessage = Read-Host "请输入提交信息（直接回车使用默认信息）"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "更新项目: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

Write-Host ""
Write-Host "步骤 3: 提交更改..." -ForegroundColor Yellow
git commit -m $commitMessage

Write-Host ""
Write-Host "步骤 4: 检查远程仓库..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ 未检测到远程仓库" -ForegroundColor Yellow
    $setupRemote = Read-Host "是否现在设置远程仓库？(Y/N)"
    if ($setupRemote -eq "Y" -or $setupRemote -eq "y") {
        $remoteUrl = Read-Host "请输入 GitHub 仓库地址（例如: https://github.com/用户名/ytkMBTI.git）"
        git remote add origin $remoteUrl
        Write-Host "✓ 远程仓库已添加" -ForegroundColor Green
    } else {
        Write-Host "请先设置远程仓库后再运行此脚本" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ 远程仓库: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "步骤 5: 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "提示：如果要求输入密码，请使用 GitHub Personal Access Token" -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✓ 代码已成功推送到 GitHub！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://vercel.com" -ForegroundColor White
    Write-Host "2. 使用 GitHub 账户登录" -ForegroundColor White
    Write-Host "3. 点击 'Add New Project'" -ForegroundColor White
    Write-Host "4. 选择你的 ytkMBTI 仓库" -ForegroundColor White
    Write-Host "5. 在 'Output Directory' 设置为: out" -ForegroundColor White
    Write-Host "6. 点击 'Deploy'" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ✗ 推送失败，请检查错误信息" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "常见问题：" -ForegroundColor Yellow
    Write-Host "1. 如果提示认证失败，请使用 Personal Access Token" -ForegroundColor White
    Write-Host "2. 如果提示分支不存在，运行: git branch -M main" -ForegroundColor White
    Write-Host "3. 查看详细部署指南: 部署指南-详细步骤.md" -ForegroundColor White
}
