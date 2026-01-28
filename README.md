# MBTI 性格测试 Landing Page

一个基于 Next.js 的 MBTI 性格测试 H5 移动端应用。

## 功能特性

- 🎯 MBTI 性格测试（25题 + 3题信息题）
- 🎨 精美的动画效果（能量球/烟花特效）
- 🌙 夜间模式（自动根据 JST 时间切换）
- 📊 测试结果统计
- 🐾 动物 emoji 统计图表
- 📱 智能应用商店跳转
- 🐦 分享到 X (Twitter)
- 📱 移动端优化

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

构建后的静态文件会在 `out` 目录中。

### 部署到 GitHub Pages

本项目已配置为支持 GitHub Pages 静态部署。

#### 自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages：
   - 进入 Settings → Pages
   - Source 选择 "GitHub Actions"
3. 每次推送到 `main` 或 `master` 分支时，GitHub Actions 会自动构建并部署

#### 手动部署

如果需要手动部署：

```bash
# 构建静态文件
npm run build

# out 目录中的文件就是可以部署的静态网站
# 可以将 out 目录的内容部署到任何静态托管服务
```

**注意**：如果部署到 GitHub Pages 的子目录（如 `username.github.io/repo-name`），需要修改 `next.config.js` 中的 `basePath` 和 `assetPrefix` 配置。

## 项目结构

```
mbti-landing-page/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # 根布局
│   ├── page.tsx         # 主页面
│   └── globals.css      # 全局样式
├── components/          # React 组件
│   ├── HeroSection.tsx  # 首页
│   ├── QuizInterface.tsx # 测试界面
│   ├── ResultPage.tsx  # 结果页
│   ├── EnergyBall.tsx  # 能量球/烟花效果
│   ├── AnimalChart.tsx # 动物统计图表
│   └── ...
├── data/                # 数据文件
│   ├── questions.ts    # 测试题目
│   └── results.ts      # MBTI 结果描述
├── utils/               # 工具函数
│   ├── calculateMBTI.ts # MBTI 计算
│   ├── animalTracker.ts # 动物跟踪
│   └── ...
└── contexts/            # React Context
    └── ThemeContext.tsx # 主题管理
```

## 版本历史

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细更新日志。

当前版本：**v1.0.4.red**

## 许可证

MIT
