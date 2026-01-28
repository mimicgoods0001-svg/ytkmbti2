'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MBTIStatistics, calculateStatistics, getTotalTests } from '@/utils/statistics'
import { cleanupDuplicateResults } from '@/utils/cleanupDuplicates'
import { mbtiResults } from '@/data/results'

interface StatisticsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StatisticsModal({ isOpen, onClose }: StatisticsModalProps) {
  const [statistics, setStatistics] = useState<MBTIStatistics[]>([])
  const [totalTests, setTotalTests] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // 自动清理重复数据
      const removed = cleanupDuplicateResults()
      if (removed > 0) {
        console.log(`清理了 ${removed} 条重复数据`)
      }
      
      const stats = calculateStatistics()
      setStatistics(stats)
      setTotalTests(getTotalTests())
    }
  }, [isOpen])


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-dark dark:text-white">
                  MBTI 統計データ
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {totalTests === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      まだ統計データがありません
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      テスト結果がここに表示されます
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        総テスト数: <span className="font-bold text-primary">{totalTests}</span> 回
                      </p>
                    </div>

                    <div className="space-y-4">
                      {statistics.map((stat) => {
                        const result = mbtiResults[stat.type]
                        return (
                          <div
                            key={stat.type}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-primary dark:text-yellow-400">
                                  {stat.type}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {result?.name || stat.type}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-dark dark:text-white">
                                  {stat.percentage}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {stat.count} 回
                                </div>
                              </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary dark:bg-yellow-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.percentage}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
