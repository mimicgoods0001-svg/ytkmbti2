/**
 * 统计数据管理
 */

export interface MBTIStatistics {
  type: string
  count: number
  percentage: number
}

interface TestResult {
  mbtiType: string
  timestamp: number
  sessionId?: string
}

const STORAGE_KEY = 'mbti_test_results'

/**
 * 保存测试结果
 */
export function saveTestResult(mbtiType: string, sessionId?: string): void {
  if (typeof window === 'undefined') return

  const results = getTestResults()
  
  // 检查是否已存在相同的sessionId
  if (sessionId) {
    const existingIndex = results.findIndex((r) => r.sessionId === sessionId)
    if (existingIndex !== -1) {
      // 已存在，不重复保存
      return
    }
  }

  const newResult: TestResult = {
    mbtiType,
    timestamp: Date.now(),
    sessionId,
  }

  results.push(newResult)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
}

/**
 * 获取所有测试结果
 */
export function getTestResults(): TestResult[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const results = JSON.parse(data) as TestResult[]
    // 兼容旧数据（没有sessionId）
    return results.map((r) => ({
      ...r,
      sessionId: r.sessionId || `legacy-${r.timestamp}`,
    }))
  } catch {
    return []
  }
}

/**
 * 计算统计数据
 */
export function calculateStatistics(): MBTIStatistics[] {
  const results = getTestResults()
  const total = results.length

  if (total === 0) return []

  const typeCounts: Record<string, number> = {}
  results.forEach((result) => {
    typeCounts[result.mbtiType] = (typeCounts[result.mbtiType] || 0) + 1
  })

  const statistics: MBTIStatistics[] = Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  return statistics
}

/**
 * 获取总测试次数
 */
export function getTotalTests(): number {
  return getTestResults().length
}
