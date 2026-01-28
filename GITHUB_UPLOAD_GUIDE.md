# GitHub 上传文件夹指南

## 方法一：使用 Git 命令行（推荐，适合开发者）

### 步骤 1：在 GitHub 上创建新仓库
1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 输入仓库名称（如：`ytkMBTI`）
4. 选择 Public 或 Private
5. **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
6. 点击 "Create repository"

### 步骤 2：在本地初始化 Git 并上传

打开 PowerShell 或命令提示符，执行以下命令：

```bash
# 1. 进入项目目录
cd C:\Users\xin\Desktop\ytkMBTI

# 2. 初始化 Git 仓库（如果还没有初始化）
git init

# 3. 添加所有文件到暂存区
git add .

# 4. 提交文件
git commit -m "Initial commit: MBTI 性格测试应用"

# 5. 添加远程仓库（将 YOUR_USERNAME 和 REPO_NAME 替换为你的信息）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 6. 推送到 GitHub（首次推送）
git branch -M main
git push -u origin main
```

**示例**：
```bash
git remote add origin https://github.com/yourusername/ytkMBTI.git
```

---

## 方法二：使用 GitHub 网页界面上传（适合小项目）

### 步骤 1：创建空仓库
1. 在 GitHub 创建新仓库（不初始化 README）

### 步骤 2：使用网页上传
1. 进入新创建的仓库页面
2. 点击 "uploading an existing file" 链接
3. 将整个项目文件夹拖拽到上传区域
   - 或者点击 "choose your files" 选择文件夹
4. 在底部输入提交信息（如："Initial commit"）
5. 点击 "Commit changes"

**注意**：网页上传适合小项目，大项目或有很多文件时可能较慢。

---

## 方法三：使用 GitHub Desktop（图形界面，最简单）

### 步骤 1：下载安装 GitHub Desktop
- 访问：https://desktop.github.com/
- 下载并安装

### 步骤 2：使用 GitHub Desktop 上传
1. 打开 GitHub Desktop
2. 点击 "File" → "Add Local Repository"
3. 选择项目文件夹：`C:\Users\xin\Desktop\ytkMBTI`
4. 如果提示不是 Git 仓库，点击 "create a repository"
5. 在左侧可以看到所有更改的文件
6. 在底部输入提交信息（如："Initial commit"）
7. 点击 "Commit to main"
8. 点击 "Publish repository" 推送到 GitHub

---

## 常见问题

### Q: 如何只上传特定文件夹？
A: 使用 `.gitignore` 文件排除不需要的文件夹，然后执行 `git add .`

### Q: 上传时提示文件太大？
A: GitHub 单个文件限制 100MB。如果超过，考虑：
- 使用 Git LFS（大文件存储）
- 将大文件移到 `.gitignore` 中排除

### Q: 如何更新已上传的文件？
A: 修改文件后执行：
```bash
git add .
git commit -m "更新说明"
git push
```

### Q: 如何删除已上传的文件？
A: 
```bash
git rm 文件名
git commit -m "删除文件"
git push
```

---

## 当前项目的注意事项

你的项目已经配置了 `.gitignore`，以下文件/文件夹**不会**被上传：
- `node_modules/` - 依赖包（太大，不需要上传）
- `.next/` - Next.js 构建文件
- `out/` - 静态导出文件
- `.env*.local` - 环境变量文件

这些文件会在部署时自动生成，所以不需要上传。
