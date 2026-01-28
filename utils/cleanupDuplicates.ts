import { getTestResults } from './statistics'

const STORAGE_KEY = 'mbti_test_results'

/**
 * 清理重复的测试结果
 */
export function cleanupDuplicateResults(): number {
  if (typeof window === 'undefined') return 0

  try {
    const results = getTestResults()
    const seen = new Set<string>()
    const unique: typeof results = []

    let removed = 0

    // 按时间戳倒序排序，保留最新的
    const sorted = [...results].sort((a, b) => b.timestamp - a.timestamp)

    sorted.forEach((result) => {
      const key = result.sessionId || `legacy-${result.timestamp}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(result)
      } else {
        removed++
      }
    })

    if (removed > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unique))
    }

    return removed
  } catch {
    return 0
  }
}
