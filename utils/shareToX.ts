import { MBTIResult } from '@/data/results'

interface AnimalStat {
  emoji: string
  count: number
  percentage: number
}

/**
 * 生成分享到 X 的文本内容（日文版）
 */
export function generateShareText(result: MBTIResult): string {
  return `私のMBTIテスト結果は：${result.name} ${result.type}\n\n${result.description}\n\n無料MBTIテストはこちら！👇\nhttps://mimicgoods0001-svg.github.io/ytkmbti2/\n\n「ヨイトキ」であなたと100％マッチする方と会おう！\nhttps://yoitoki.app.link/Liamedium`
}

/**
 * 检测是否为移动设备
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 检测是否为iOS设备
 */
function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * 分享到 X (Twitter)
 */
export async function shareToX(result: MBTIResult, imageUrl?: string) {
  const text = generateShareText(result)
  
  // 只在移动设备上使用 Web Share API（桌面浏览器使用传统方式）
  if (imageUrl && isMobileDevice() && navigator.share && navigator.canShare) {
    try {
      // 将blob URL转换为File对象
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], `mbti-${result.type}-result.png`, { type: 'image/png' })
      
      // 检查是否可以分享文件
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          text: text,
          files: [file],
        })
        return
      }
    } catch (error) {
      console.log('Web Share API失败，使用传统方式:', error)
    }
  }
  
  // 传统方式：使用Twitter Intent（文案中已包含链接）
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(twitterUrl, '_blank', 'width=550,height=420')
}

/**
 * 检测当前主题
 */
function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

/**
 * 使用 Canvas 生成结果图片（优化版，支持中文和动物统计，支持主题模式）
 */
export async function generateResultImage(
  result: MBTIResult,
  animalStats: AnimalStat[] = []
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 创建 canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('无法创建 canvas 上下文'))
      return
    }

    // 检测当前主题
    const isDark = isDarkMode()

    // 设置 canvas 尺寸（适合 X 分享的尺寸）
    const width = 1200
    const height = animalStats.length > 0 ? 900 : 700
    canvas.width = width
    canvas.height = height

    // 绘制圆角矩形辅助函数
    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    // 根据主题绘制背景
    if (isDark) {
      // 黑夜模式：深色背景
      const darkGradient = ctx.createLinearGradient(0, 0, width, height)
      darkGradient.addColorStop(0, '#1a1a2e')
      darkGradient.addColorStop(0.5, '#16213e')
      darkGradient.addColorStop(1, '#0f3460')
      ctx.fillStyle = darkGradient
      ctx.fillRect(0, 0, width, height)

      // 黑夜模式的emoji装饰（更少，更透明，只在边缘）
      const emojiDecorations = ['✨', '🌟', '💫', '⭐', '🌙', '🦉', '🦇', '🌌']
      ctx.globalAlpha = 0.08
      // 只在边缘区域放置emoji，避免遮挡文字
      for (let i = 0; i < 15; i++) {
        let x, y
        // 随机选择边缘区域
        const edge = Math.floor(Math.random() * 4)
        if (edge === 0) { // 上边缘
          x = Math.random() * width
          y = Math.random() * 100
        } else if (edge === 1) { // 下边缘
          x = Math.random() * width
          y = height - 100 + Math.random() * 100
        } else if (edge === 2) { // 左边缘
          x = Math.random() * 100
          y = Math.random() * height
        } else { // 右边缘
          x = width - 100 + Math.random() * 100
          y = Math.random() * height
        }
        const size = 25 + Math.random() * 30
        ctx.font = `${size}px Arial`
        ctx.fillText(emojiDecorations[Math.floor(Math.random() * emojiDecorations.length)], x, y)
      }
      ctx.globalAlpha = 1.0

      // 黑夜模式边框（紫色和蓝色）
      ctx.strokeStyle = '#9d4edd'
      ctx.lineWidth = 8
      drawRoundedRect(20, 20, width - 40, height - 40, 30)
      ctx.stroke()

      ctx.strokeStyle = '#4cc9f0'
      ctx.lineWidth = 4
      drawRoundedRect(35, 35, width - 70, height - 70, 20)
      ctx.stroke()
    } else {
      // 白昼模式：浅色背景
      const mainGradient = ctx.createLinearGradient(0, 0, width, height)
      mainGradient.addColorStop(0, '#fff8e1')
      mainGradient.addColorStop(0.5, '#ffe0b2')
      mainGradient.addColorStop(1, '#ffccbc')
      ctx.fillStyle = mainGradient
      ctx.fillRect(0, 0, width, height)

      // 白昼模式的emoji装饰（只在边缘，避免遮挡文字）
      const emojiDecorations = ['✨', '🌟', '💫', '⭐', '🎉', '🎊', '🌈', '🦄']
      ctx.globalAlpha = 0.12
      // 只在边缘区域放置emoji
      for (let i = 0; i < 15; i++) {
        let x, y
        const edge = Math.floor(Math.random() * 4)
        if (edge === 0) { // 上边缘
          x = Math.random() * width
          y = Math.random() * 100
        } else if (edge === 1) { // 下边缘
          x = Math.random() * width
          y = height - 100 + Math.random() * 100
        } else if (edge === 2) { // 左边缘
          x = Math.random() * 100
          y = Math.random() * height
        } else { // 右边缘
          x = width - 100 + Math.random() * 100
          y = Math.random() * height
        }
        const size = 25 + Math.random() * 30
        ctx.font = `${size}px Arial`
        ctx.fillText(emojiDecorations[Math.floor(Math.random() * emojiDecorations.length)], x, y)
      }
      ctx.globalAlpha = 1.0

      // 白昼模式边框（红色和青色）
      ctx.strokeStyle = '#ff6b6b'
      ctx.lineWidth = 8
      drawRoundedRect(20, 20, width - 40, height - 40, 30)
      ctx.stroke()

      ctx.strokeStyle = '#4ecdc4'
      ctx.lineWidth = 4
      drawRoundedRect(35, 35, width - 70, height - 70, 20)
      ctx.stroke()
    }

    // 设置字体（使用系统字体，支持中文）
    const titleFont = 'bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    const descFont = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    const tagFont = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    const footerFont = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    const chartTitleFont = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    const chartFont = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'

    // 根据主题设置颜色
    const titleColor = isDark ? '#ff6b9d' : '#ff6b6b'
    const titleShadowColor = isDark ? '#000000' : '#333333'
    const descColor = isDark ? '#e0e0e0' : '#2c3e50'
    const tagBgColor = isDark ? '#2d1b3d' : '#fff3cd'
    const tagTextColor = isDark ? '#d4a5ff' : '#856404'
    const chartTitleBgColor = isDark ? '#1e3a5f' : '#e3f2fd'
    const chartTitleTextColor = isDark ? '#90caf9' : '#1565c0'
    const footerBgColor = isDark ? '#2d1b3d' : '#f3e5f5'
    const footerTextColor = isDark ? '#d4a5ff' : '#7b1fa2'

    // 绘制标题
    const titleY = 110
    
    ctx.font = titleFont
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    // 标题文字（带阴影效果）
    ctx.fillStyle = titleShadowColor
    ctx.fillText(`${result.name} ${result.type}`, width / 2 + 2, titleY + 2)
    ctx.fillStyle = titleColor
    ctx.fillText(`${result.name} ${result.type}`, width / 2, titleY)

    // 绘制描述（处理换行，增加安全区域）
    ctx.fillStyle = descColor
    ctx.font = descFont
    ctx.textAlign = 'center' // 确保文字居中
    ctx.textBaseline = 'top'
    const maxWidth = width - 300 // 增加左右边距，避免文字被遮挡
    const lineHeight = 42
    let y = 220 // 增加顶部间距
    
    // 简单的中文换行处理
    const description = wrapChineseText(result.description, 35)
    description.forEach((line) => {
      ctx.fillText(line, width / 2, y)
      y += lineHeight
    })

    // 绘制标签（带emoji和背景，确保在面板中间，往上移动）
    ctx.font = tagFont
    const tagsText = result.tags.join('  ')
    const tagsWidth = ctx.measureText(tagsText).width
    
    // 标签背景（圆角矩形，往上移动一些）
    const tagBgY = y + 20 // 从30改为20，往上移动
    const tagBgHeight = 50
    const tagBgPadding = 20
    const tagBgX = width / 2 - tagsWidth / 2 - tagBgPadding
    const tagBgW = tagsWidth + tagBgPadding * 2
    
    ctx.fillStyle = tagBgColor
    drawRoundedRect(
      tagBgX,
      tagBgY - 10,
      tagBgW,
      tagBgHeight,
      15
    )
    ctx.fill()
    
    // 标签文字（确保在背景中间）
    ctx.fillStyle = tagTextColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(tagsText, width / 2, tagBgY + 15)

    // 绘制动物统计图表
    if (animalStats.length > 0) {
      y += 100
      
      // 图表标题（带emoji和背景，使用主题颜色）
      const chartTitleText = '今回のテストで出現した動物'
      ctx.font = chartTitleFont
      const chartTitleWidth = ctx.measureText(chartTitleText).width
      
      // 标题背景（使用主题颜色）
      ctx.fillStyle = chartTitleBgColor
      drawRoundedRect(
        width / 2 - chartTitleWidth / 2 - 30,
        y - 15,
        chartTitleWidth + 60,
        60,
        20
      )
      ctx.fill()
      
      // 标题文字（使用主题颜色）
      ctx.fillStyle = chartTitleTextColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(chartTitleText, width / 2, y + 15)
      
      y += 80 // 增加间距，让柱状图下移

      // 绘制柱状图（计算居中位置）
      const chartStartX = width / 2 - 400
      const chartWidth = 800
      const chartHeight = 180
      const barSpacing = 15
      const availableWidth = chartWidth - (animalStats.length - 1) * barSpacing
      const barWidth = Math.min(availableWidth / animalStats.length, 80)
      const maxCount = Math.max(...animalStats.map((s) => s.count))
      
      // 计算柱状图在空白区域的垂直居中位置
      const chartAreaTop = y
      const chartAreaBottom = height - 150 // 底部区域上方
      const chartAreaHeight = chartAreaBottom - chartAreaTop
      const chartVerticalCenter = chartAreaTop + chartAreaHeight / 2
      const chartTopY = chartVerticalCenter - chartHeight / 2

      animalStats.forEach((stat, index) => {
        const barX = chartStartX + index * (barWidth + barSpacing)
        const barHeight = maxCount > 0 ? (stat.count / maxCount) * chartHeight : 0
        const barY = chartTopY + chartHeight - barHeight

        // 绘制柱子（使用主题颜色）
        const barGradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY + barHeight)
        if (isDark) {
          barGradient.addColorStop(0, '#9d4edd')
          barGradient.addColorStop(1, '#4cc9f0')
        } else {
          barGradient.addColorStop(0, '#c5994b')
          barGradient.addColorStop(1, '#ff174d')
        }
        ctx.fillStyle = barGradient
        ctx.fillRect(barX, barY, barWidth, barHeight)

        // 绘制柱子边框（使用主题颜色）
        ctx.strokeStyle = isDark ? '#ffffff' : '#391f1f'
        ctx.lineWidth = 2
        ctx.strokeRect(barX, barY, barWidth, barHeight)

        // 绘制动物emoji（在柱子顶部上方，再往上移动5px）
        ctx.font = '36px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText(stat.emoji, barX + barWidth / 2, barY - 25) // 从-20改为-25，再往上移动5px

        // 绘制数量（在柱子顶部，使用主题颜色）
        ctx.fillStyle = isDark ? '#ffffff' : '#391f1f'
        ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ctx.textBaseline = 'bottom'
        const countText = `${stat.count}回`
        ctx.fillText(countText, barX + barWidth / 2, barY - 5)
      })

      // 更新y位置为柱状图底部
      y = chartTopY + chartHeight + 30
    }

    // 绘制底部文字（带背景，移除遮挡文字的emoji）
    const footerY = height - 100 // 增加底部间距
    const footerBgHeight = 70 // 增加高度以容纳更多内容
    
    // 底部背景（使用主题颜色）
    ctx.fillStyle = footerBgColor
    drawRoundedRect(50, footerY - 10, width - 100, footerBgHeight, 15)
    ctx.fill()
    
    // 底部文字（使用主题颜色，确保文字清晰可见）
    ctx.fillStyle = footerTextColor
    ctx.font = footerFont
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 第一行文字（增加间距，日文版）
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif'
    ctx.fillText('「ヨイトキ」であなたと100％マッチする方と会おう！', width / 2, footerY + 15)
    
    // 第二行文字（增加间距，避免贴边）
    ctx.font = footerFont
    ctx.fillText('yoitoki.app.link/Liamedium', width / 2, footerY + 45)
    
    // emoji装饰移到背景外部（不遮挡文字）
    ctx.font = '32px Arial'
    ctx.fillText('💕', 80, footerY + 15) // 左侧外部
    ctx.fillText('🎉', width - 80, footerY + 15) // 右侧外部

    // 转换为图片
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        resolve(url)
      } else {
        reject(new Error('无法生成图片'))
      }
    }, 'image/png')
  })
}

/**
 * 中文文本换行辅助函数
 */
function wrapChineseText(text: string, charsPerLine: number): string[] {
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < text.length; i++) {
    currentLine += text[i]
    if (currentLine.length >= charsPerLine || i === text.length - 1) {
      lines.push(currentLine)
      currentLine = ''
    }
  }

  return lines
}

/**
 * 下载图片
 */
export function downloadImage(imageUrl: string, filename: string = 'mbti-result.png') {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // 清理 URL
  setTimeout(() => URL.revokeObjectURL(imageUrl), 100)
}
