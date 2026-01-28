'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MBTIResult } from '@/data/results'
import { shareToX, generateResultImage, downloadImage, generateShareText } from '@/utils/shareToX'
import { getDownloadLink, detectDevice } from '@/utils/appStoreLinks'
import StatisticsModal from './StatisticsModal'
import { getAnimalStatistics } from '@/utils/animalTracker'
import AnimalChart from './AnimalChart'

interface ResultPageProps {
  result: MBTIResult
  onRestart: () => void
  animals: string[]
}

export default function ResultPage({ result, onRestart, animals }: ResultPageProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('https://yoitoki.jp/ja')
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop')
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [saveImageUrl, setSaveImageUrl] = useState<string>('')
  
  const animalStats = getAnimalStatistics(animals)

  useEffect(() => {
    const device = detectDevice()
    setDeviceType(device)
    setDownloadUrl(getDownloadLink())
  }, [])

  // 保存结果：移动设备显示弹窗，桌面设备直接下载
  const handleSaveResult = async () => {
    try {
      setIsGeneratingImage(true)
      // 生成图片（包含动物统计）
      const imageUrl = await generateResultImage(result, animalStats)
      
      // 检测是否为移动设备
      const isMobile = isMobileDevice()
      
      if (isMobile) {
        // 移动设备：将blob URL转换为data URL，然后在弹窗中显示
        try {
          // 将blob URL转换为base64 data URL
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          const reader = new FileReader()
          
          reader.onloadend = () => {
            const base64data = reader.result as string
            setSaveImageUrl(base64data)
            setIsSaveModalOpen(true)
            setIsGeneratingImage(false)
          }
          
          reader.onerror = () => {
            console.error('读取图片失败')
            alert('画像の生成に失敗しました。もう一度お試しください。')
            setIsGeneratingImage(false)
          }
          
          reader.readAsDataURL(blob)
        } catch (error) {
          console.error('保存图片失败:', error)
          alert('画像の生成に失敗しました。もう一度お試しください。')
          setIsGeneratingImage(false)
        }
      } else {
        // 桌面设备：直接下载图片到下载文件夹
        downloadImage(imageUrl, `mbti-${result.type}-result.png`)
        setIsGeneratingImage(false)
      }
    } catch (error) {
      console.error('生成图片失败:', error)
      setIsGeneratingImage(false)
    }
  }

  // 转发到X：打开X并预输入文案
  const handleShareToX = async () => {
    try {
      // 直接打开Twitter分享页面，文案已准备好（文案中已包含链接）
      const text = generateShareText(result)
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
      window.open(twitterUrl, '_blank')
    } catch (error) {
      console.error('打开Twitter失败:', error)
    }
  }
  
  // 检测是否为移动设备
  const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-b from-white to-primary/5 dark:from-black dark:via-slate-900 dark:to-black transition-colors duration-300 relative">
      {/* Statistics Button - 有趣的图标 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsStatisticsOpen(true)}
        className="fixed top-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 dark:from-purple-600 dark:via-pink-600 dark:to-yellow-500 shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl"
        aria-label="統計データを見る"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </motion.button>

      <StatisticsModal
        isOpen={isStatisticsOpen}
        onClose={() => setIsStatisticsOpen(false)}
      />

      {/* 保存图片弹窗 */}
      {isSaveModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/90 p-4"
          onClick={() => setIsSaveModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 图片容器 */}
            <div 
              className="mb-6 -webkit-touch-callout-default"
              style={{ 
                WebkitTouchCallout: 'default',
                touchAction: 'manipulation'
              }}
            >
              <img 
                src={saveImageUrl} 
                alt="MBTIテスト結果" 
                className="w-full h-auto rounded-xl shadow-lg select-none"
                style={{ 
                  WebkitTouchCallout: 'default',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  pointerEvents: 'auto',
                  touchAction: 'manipulation'
                }}
                draggable={false}
              />
            </div>

            {/* 提示文字 */}
            <div className="text-center">
              <div className="text-4xl mb-3">📸</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                  <>
                    画像を長押しして<br />「写真に保存」を選択してください
                  </>
                ) : (
                  <>
                    画像を長押しして<br />「画像を保存」または「写真に保存」を選択してください
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto w-full"
      >
        {/* Personality Type */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-primary dark:text-yellow-400 leading-tight px-2">
            {result.name} {result.type}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2"
        >
          {result.description}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2"
        >
          {result.tags.map((tag, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-primary/10 dark:bg-yellow-400/20 text-primary dark:text-yellow-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Animal Statistics Chart */}
        {animalStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-6 sm:mb-8 px-2"
          >
            <AnimalChart stats={animalStats} totalCount={animals.length} />
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4 px-2"
        >
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-dark dark:text-white mb-4 sm:mb-6">
            「ヨイトキ」であなたの魂の色彩と100％マッチするパートナーを探そう
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary active:bg-primary/90 text-white font-bold py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 w-full sm:w-auto min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
            >
              {deviceType === 'ios' && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              {deviceType === 'android' && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5674.416.416 0 00-.5674.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1349 1.2297L4.8429 5.5773a.4161.4161 0 00-.5674-.1521.4157.4157 0 00-.1521.5674l1.9973 3.4592C2.6889 11.186.8535 12.3104.8535 13.8218c0 .7492.4245 1.3773 1.2287 1.8528-.0406.1754-.0609.3548-.0609.5374 0 1.5748 1.3389 2.8528 2.9902 2.8528 1.6514 0 2.9902-1.278 2.9902-2.8528 0-.1826-.0203-.362-.0609-.5374.8042-.4755 1.2287-1.1036 1.2287-1.8528 0-1.5114-1.8354-2.6358-4.1349-3.5007l2.0223 3.503a.4159.4159 0 00.5674.1521.4157.4157 0 00.1521-.5674l-1.9973-3.4592c1.5447-.8366 3.2816-1.2297 5.1349-1.2297s3.5902.3931 5.1349 1.2297l-1.9973 3.4592a.4161.4161 0 00.1521.5674.4159.4159 0 00.5674-.1521l2.0223-3.503c2.2995.8649 4.1349 1.9893 4.1349 3.5007 0 .7492-.4245 1.3773-1.2287 1.8528.0406.1754.0609.3548.0609.5374 0 1.5748-1.3389 2.8528-2.9902 2.8528-1.6514 0-2.9902-1.278-2.9902-2.8528 0-.1826.0203-.362.0609-.5374-.8042-.4755-1.2287-1.1036-1.2287-1.8528 0-1.5114-1.8354-2.6358-4.1349-3.5007z" />
                </svg>
              )}
              {deviceType === 'desktop' && (
                <img
                  src="/yoitoki-icon.png"
                  alt="Yoitoki"
                  className="w-6 h-6 object-contain"
                />
              )}
              Yoitoki いますぐDL
            </motion.a>

            <motion.button
              onClick={handleSaveResult}
              disabled={isGeneratingImage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 w-full sm:w-auto min-h-[48px] touch-manipulation flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  読み込み中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
                  </svg>
                  結果を保存
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleShareToX}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black dark:bg-white text-white dark:text-black font-bold py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all duration-300 w-full sm:w-auto min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xにシェア
            </motion.button>
          </div>

          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 text-primary dark:text-yellow-400 font-semibold py-3 px-6 rounded-full text-base sm:text-lg hover:bg-primary/10 dark:hover:bg-yellow-400/20 transition-all duration-300 min-h-[44px] touch-manipulation"
          >
            もう一度
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
