/**
 * 初始化统计数据 - 为每个MBTI类型填入200~500的随机基础数据
 * 用于上线前的数据准备
 */

import { mbtiResults } from '@/data/results'

const STORAGE_KEY = 'mbti_test_results'

/**
 * 清除所有统计数据
 */
export function clearAllStatistics(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  console.log('已清除所有统计数据')
}

/**
 * 为每个MBTI类型生成随机数量的测试结果（200~500之间）
 */
export function initializeStatistics(): void {
  if (typeof window === 'undefined') return

  // 清除现有数据
  clearAllStatistics()

  const results: Array<{
    mbtiType: string
    timestamp: number
    sessionId: string
  }> = []

  // 为每个MBTI类型生成随机数量的测试结果
  Object.keys(mbtiResults).forEach((mbtiType) => {
    // 生成200~500之间的随机数
    const count = 200 + Math.floor(Math.random() * 301) // 200 + 0~300 = 200~500

    // 为每个结果生成时间戳（分布在过去30天内）
    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

    for (let i = 0; i < count; i++) {
      // 随机时间戳（过去30天内）
      const randomTimestamp = thirtyDaysAgo + Math.floor(Math.random() * (now - thirtyDaysAgo))
      const sessionId = `init-${mbtiType}-${i}-${randomTimestamp}`

      results.push({
        mbtiType,
        timestamp: randomTimestamp,
        sessionId,
      })
    }
  })

  // 按时间戳排序（最新的在前）
  results.sort((a, b) => b.timestamp - a.timestamp)

  // 保存到localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))

  console.log(`已初始化统计数据：${results.length} 条记录`)
  console.log('各类型数量：')
  const typeCounts: Record<string, number> = {}
  results.forEach((r) => {
    typeCounts[r.mbtiType] = (typeCounts[r.mbtiType] || 0) + 1
  })
  Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })
}

/**
 * 在开发环境中调用此函数来初始化数据
 * 使用方法：在浏览器控制台运行 window.initializeMBTIStats()
 */
if (typeof window !== 'undefined') {
  ;(window as any).initializeMBTIStats = initializeStatistics
  ;(window as any).clearMBTIStats = clearAllStatistics
}
