'use client'

import { useState } from 'react'
import { initializeStatistics, clearAllStatistics } from '@/utils/initializeStatistics'

export default function InitStatsPage() {
  const [status, setStatus] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const handleInitialize = () => {
    try {
      initializeStatistics()
      setStatus('成功！')
      setResult('统计数据已初始化，每个MBTI类型已填入200~500的随机数据。')
      
      // 显示详细信息
      setTimeout(() => {
        const data = localStorage.getItem('mbti_test_results')
        if (data) {
          const results = JSON.parse(data)
          const typeCounts: Record<string, number> = {}
          results.forEach((r: any) => {
            typeCounts[r.mbtiType] = (typeCounts[r.mbtiType] || 0) + 1
          })
          
          let detail = `总记录数：${results.length}\n\n各类型数量：\n`
          Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
              detail += `${type}: ${count}\n`
            })
          
          setResult(detail)
        }
      }, 100)
    } catch (error) {
      setStatus('错误！')
      setResult(`初始化失败：${error}`)
    }
  }

  const handleClear = () => {
    try {
      clearAllStatistics()
      setStatus('成功！')
      setResult('所有统计数据已清除。')
    } catch (error) {
      setStatus('错误！')
      setResult(`清除失败：${error}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          统计数据初始化工具
        </h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={handleInitialize}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            初始化统计数据（清除旧数据并填入200~500的随机数）
          </button>
          
          <button
            onClick={handleClear}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            清除所有统计数据
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded-lg ${status === '成功！' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className={`font-semibold mb-2 ${status === '成功！' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {status}
            </p>
            {result && (
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {result}
              </pre>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>说明：</strong>
            <br />
            • 初始化会清除所有现有数据
            <br />
            • 为每个MBTI类型（16种）生成200~500之间的随机数据
            <br />
            • 时间戳分布在过去30天内
            <br />
            • 初始化完成后，可以关闭此页面
          </p>
        </div>
      </div>
    </div>
  )
}
