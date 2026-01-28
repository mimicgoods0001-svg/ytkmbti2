'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import QuizInterface from '@/components/QuizInterface'
import ResultPage from '@/components/ResultPage'
import ThemeToggle from '@/components/ThemeToggle'
import { Question } from '@/data/questions'
import { MBTIResult } from '@/data/results'
import { calculateMBTI } from '@/utils/calculateMBTI'
import { questions } from '@/data/questions'
import { mbtiResults } from '@/data/results'
import { saveTestResult } from '@/utils/statistics'

type PageState = 'hero' | 'quiz' | 'result'

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('hero')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({})
  const [result, setResult] = useState<MBTIResult | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [currentTestAnimals, setCurrentTestAnimals] = useState<string[]>([])

  const handleStartQuiz = () => {
    // 生成新的会话ID
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setCurrentSessionId(sessionId)
    setCurrentTestAnimals([]) // 重置动物统计
    setPageState('quiz')
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  const handleAnimalUsed = (animal: string) => {
    setCurrentTestAnimals((prev) => [...prev, animal])
  }

  const handleAnswer = (questionId: number, answer: 'A' | 'B') => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 300)
    } else {
      // Quiz completed, calculate result
      const mbtiType = calculateMBTI(questions, newAnswers)
      const mbtiResult = mbtiResults[mbtiType]
      setResult(mbtiResult)
      // 保存测试结果（使用会话ID确保只保存一次）
      if (currentSessionId) {
        saveTestResult(mbtiType, currentSessionId)
      }
      setTimeout(() => {
        setPageState('result')
      }, 500)
    }
  }

  const handleRestart = () => {
    setPageState('hero')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setResult(null)
    setCurrentSessionId('') // 清除会话ID
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-slate-900 dark:to-black transition-colors duration-300">
      <ThemeToggle />
      <AnimatePresence mode="wait">
        {pageState === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroSection onStart={handleStartQuiz} />
          </motion.div>
        )}

        {pageState === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizInterface
              currentQuestion={questions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onAnimalUsed={handleAnimalUsed}
            />
          </motion.div>
        )}

        {pageState === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultPage result={result} onRestart={handleRestart} animals={currentTestAnimals} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
