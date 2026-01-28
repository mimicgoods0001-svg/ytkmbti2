'use client'

import { motion } from 'framer-motion'

interface AnimalStat {
  emoji: string
  count: number
  percentage: number
}

interface AnimalChartProps {
  stats: AnimalStat[]
  totalCount: number
}

export default function AnimalChart({ stats, totalCount }: AnimalChartProps) {
  if (stats.length === 0) return null

  const maxCount = Math.max(...stats.map((s) => s.count))

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-dark dark:text-white mb-4 text-center">
        今回のテストで出現した動物（合計個数：{totalCount}個）
      </h3>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.emoji}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl w-10 text-center flex items-center justify-center" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{stat.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.count} 回
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.percentage}%
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
