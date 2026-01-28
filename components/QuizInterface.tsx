'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question } from '@/data/questions'
import EnergyBall from './EnergyBall'
import { getColorByDimension, getAllMBTIColors, MBTIColorKey } from '@/utils/mbtiColors'
import { getRandomAnimal } from '@/utils/animalTracker'

interface QuizInterfaceProps {
  currentQuestion: Question
  questionIndex: number
  totalQuestions: number
  onAnswer: (questionId: number, answer: 'A' | 'B') => void
  onAnimalUsed?: (animal: string) => void
}

export default function QuizInterface({
  currentQuestion,
  questionIndex,
  totalQuestions,
  onAnswer,
  onAnimalUsed,
}: QuizInterfaceProps) {
  const [energyBalls, setEnergyBalls] = useState<
    Array<{ id: number; startX: number; startY: number; endX: number; endY: number; color: MBTIColorKey; animal: string }>
  >([])
  const progressBarRef = useRef<HTMLDivElement>(null)
  const ballIdRef = useRef(0)
  // 跟踪每个选项的点击次数（最多3次），以及已选择的选项
  const [clickCounts, setClickCounts] = useState<{ A: number; B: number }>({ A: 0, B: 0 })
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null)

  // 计算进度：回答完第25题后达到100%
  // 显示第N题时，进度应该是 (N-1)/25，这样回答完第25题后才是100%
  const mbtiQuestionsCount = 25
  const progress = currentQuestion.id <= mbtiQuestionsCount
    ? Math.round(((currentQuestion.id - 1) / mbtiQuestionsCount) * 100)
    : 100

  // 当题目改变时，重置点击计数和选择状态
  useEffect(() => {
    setClickCounts({ A: 0, B: 0 })
    setSelectedAnswer(null)
  }, [questionIndex])

  const handleAnswerClick = (
    questionId: number,
    answer: 'A' | 'B',
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // INFO问题（26-28）不受限制
    const isInfoQuestion = currentQuestion.dimension === 'INFO'
    
    // 对于1-25题，如果已经选择了另一个选项，则禁用当前选项
    if (!isInfoQuestion && selectedAnswer !== null && selectedAnswer !== answer) {
      return // 已选择另一个选项，不能再点击当前选项
    }

    // 对于1-25题，检查点击次数限制（最多3次）
    if (!isInfoQuestion && clickCounts[answer] >= 3) {
      return // 已达到最大点击次数，不再处理
    }

    // 更新选择状态（1-25题）
    if (!isInfoQuestion) {
      setSelectedAnswer(answer)
    }

    // 更新点击计数（1-25题）
    if (!isInfoQuestion) {
      setClickCounts((prev) => ({
        ...prev,
        [answer]: prev[answer] + 1,
      }))
    }

    // 只在非INFO题目时显示能量球效果
    if (currentQuestion.dimension !== 'INFO' && progressBarRef.current) {
      const button = event.currentTarget
      const buttonRect = button.getBoundingClientRect()
      const progressBarRect = progressBarRef.current.getBoundingClientRect()

      // 计算按钮中心位置
      const startX = buttonRect.left + buttonRect.width / 2
      const startY = buttonRect.top + buttonRect.height / 2

      // 计算进度条位置（增加更多轨迹变化）
      const progressBarCenterX = progressBarRect.left + progressBarRect.width / 2
      const progressBarCenterY = progressBarRect.top + progressBarRect.height / 2
      const progressBarWidth = progressBarRect.width

      // 获取当前题目对应的主颜色
      const primaryColor = getColorByDimension(currentQuestion.dimension)
      const allColors = getAllMBTIColors()

      // 检测当前主题
      const isDark = document.documentElement.classList.contains('dark')

      // 创建更多能量球（8-12个），增加视觉效果
      const ballCount = 8 + Math.floor(Math.random() * 5)
      const newBalls = Array.from({ length: ballCount }, () => {
        ballIdRef.current += 1
        
        // 随机选择颜色（70%使用主颜色，30%使用其他颜色）
        const usePrimaryColor = Math.random() < 0.7
        const color: MBTIColorKey = usePrimaryColor
          ? primaryColor
          : allColors[Math.floor(Math.random() * allColors.length)]

        // 随机选择动物
        const animal = getRandomAnimal(isDark)
        
        // 通知父组件使用的动物
        if (onAnimalUsed) {
          onAnimalUsed(animal)
        }

        // 按钮位置的随机偏移（更大的范围）
        const startOffsetX = (Math.random() - 0.5) * 60
        const startOffsetY = (Math.random() - 0.5) * 60

        // 进度条目标位置的随机偏移（更分散的轨迹）
        // 让能量球分散到进度条的不同位置
        const progressRatio = Math.random() // 0-1，决定在进度条的哪个位置
        const endX = progressBarRect.left + progressRatio * progressBarWidth
        const endOffsetY = (Math.random() - 0.5) * 30 // 垂直方向的偏移

        return {
          id: ballIdRef.current,
          startX: startX + startOffsetX,
          startY: startY + startOffsetY,
          endX: endX + (Math.random() - 0.5) * 15,
          endY: progressBarCenterY + endOffsetY,
          color,
          animal,
        }
      })

      setEnergyBalls((prev) => [...prev, ...newBalls])
    }

    // 延迟执行答案处理，让能量球动画先开始
    setTimeout(() => {
      onAnswer(questionId, answer)
    }, 100)
  }

  const removeEnergyBall = (id: number) => {
    setEnergyBalls((prev) => prev.filter((ball) => ball.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 py-6 sm:py-8 bg-white dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-slate-900 dark:to-black transition-colors duration-300">
      {/* Energy Balls Container */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {energyBalls.map((ball) => (
          <EnergyBall
            key={ball.id}
            startX={ball.startX}
            startY={ball.startY}
            endX={ball.endX}
            endY={ball.endY}
            color={ball.color}
            animal={ball.animal}
            onComplete={() => removeEnergyBall(ball.id)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            質問 {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-sm sm:text-base font-semibold text-primary dark:text-yellow-400">
            {progress}%
          </span>
        </div>
        <div
          ref={progressBarRef}
          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark dark:text-white mb-8 sm:mb-10 text-center leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {currentQuestion.optionB ? (
              // 两个选项的情况
              <>
                <motion.button
                  disabled={
                    currentQuestion.dimension !== 'INFO' && 
                    (clickCounts.A >= 3 || (selectedAnswer !== null && selectedAnswer !== 'A'))
                  }
                  whileHover={
                    currentQuestion.dimension === 'INFO' || 
                    (clickCounts.A < 3 && (selectedAnswer === null || selectedAnswer === 'A'))
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    currentQuestion.dimension === 'INFO' || 
                    (clickCounts.A < 3 && (selectedAnswer === null || selectedAnswer === 'A'))
                      ? { scale: 0.98 }
                      : {}
                  }
                  onClick={(e) => handleAnswerClick(currentQuestion.id, 'A', e)}
                  className={`w-full text-white font-semibold py-4 sm:py-5 px-6 rounded-xl text-base sm:text-lg shadow-lg transition-all duration-300 min-h-[56px] touch-manipulation ${
                    currentQuestion.dimension !== 'INFO' && 
                    (clickCounts.A >= 3 || (selectedAnswer !== null && selectedAnswer !== 'A'))
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {currentQuestion.optionA}
                  {currentQuestion.dimension !== 'INFO' && clickCounts.A > 0 && clickCounts.A < 3 && (
                    <span className="ml-2 text-xs opacity-75">({clickCounts.A}/3)</span>
                  )}
                  {currentQuestion.dimension !== 'INFO' && clickCounts.A >= 3 && (
                    <span className="ml-2 text-xs opacity-75">(最大回数)</span>
                  )}
                </motion.button>
                <motion.button
                  disabled={
                    currentQuestion.dimension !== 'INFO' && 
                    (clickCounts.B >= 3 || (selectedAnswer !== null && selectedAnswer !== 'B'))
                  }
                  whileHover={
                    currentQuestion.dimension === 'INFO' || 
                    (clickCounts.B < 3 && (selectedAnswer === null || selectedAnswer === 'B'))
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    currentQuestion.dimension === 'INFO' || 
                    (clickCounts.B < 3 && (selectedAnswer === null || selectedAnswer === 'B'))
                      ? { scale: 0.98 }
                      : {}
                  }
                  onClick={(e) => handleAnswerClick(currentQuestion.id, 'B', e)}
                  className={`w-full text-white font-semibold py-4 sm:py-5 px-6 rounded-xl text-base sm:text-lg shadow-lg transition-all duration-300 min-h-[56px] touch-manipulation ${
                    currentQuestion.dimension !== 'INFO' && 
                    (clickCounts.B >= 3 || (selectedAnswer !== null && selectedAnswer !== 'B'))
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                      : 'bg-secondary hover:bg-secondary/90'
                  }`}
                >
                  {currentQuestion.optionB}
                  {currentQuestion.dimension !== 'INFO' && clickCounts.B > 0 && clickCounts.B < 3 && (
                    <span className="ml-2 text-xs opacity-75">({clickCounts.B}/3)</span>
                  )}
                  {currentQuestion.dimension !== 'INFO' && clickCounts.B >= 3 && (
                    <span className="ml-2 text-xs opacity-75">(最大回数)</span>
                  )}
                </motion.button>
              </>
            ) : (
              // 只有一个选项的情况（INFO问题，无限制）
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleAnswerClick(currentQuestion.id, 'A', e)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl text-base sm:text-lg shadow-lg transition-all duration-300 min-h-[56px] touch-manipulation"
              >
                {currentQuestion.optionA}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
