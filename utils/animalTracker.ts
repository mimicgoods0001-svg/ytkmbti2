/**
 * 动物emoji跟踪工具
 */

// 昼间模式动物列表
export const DAY_ANIMALS = ['🐱', '🐶', '🦘', '🦊', '🐦', '🐰', '🐻', '🐼', '🦁', '🐯']

// 夜间模式动物列表
export const NIGHT_ANIMALS = ['🐱', '🐶', '🐿️', '🦊', '🦉', '🐺', '🦝', '🐾']

/**
 * 获取当前主题对应的动物列表
 */
export function getAnimalsForTheme(isDark: boolean): string[] {
  return isDark ? NIGHT_ANIMALS : DAY_ANIMALS
}

/**
 * 随机选择一个动物
 */
export function getRandomAnimal(isDark: boolean): string {
  const animals = getAnimalsForTheme(isDark)
  return animals[Math.floor(Math.random() * animals.length)]
}

/**
 * 统计动物数量
 */
export function countAnimals(animals: string[]): Record<string, number> {
  const counts: Record<string, number> = {}
  animals.forEach((animal) => {
    counts[animal] = (counts[animal] || 0) + 1
  })
  return counts
}

/**
 * 获取动物统计数组（用于图表）
 */
export function getAnimalStatistics(animals: string[]): Array<{ emoji: string; count: number; percentage: number }> {
  const total = animals.length
  if (total === 0) return []

  const counts = countAnimals(animals)
  const stats = Object.entries(counts)
    .map(([emoji, count]) => ({
      emoji,
      count,
      percentage: Math.round((count / total) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count) // 按数量降序

  return stats
}
