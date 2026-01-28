'use client'

import { motion } from 'framer-motion'

interface HeroSectionProps {
  onStart: () => void
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-white via-primary/5 to-white dark:from-black dark:via-slate-900 dark:to-black transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-dark dark:text-white"
        >
          MBTIテスト
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl mb-4 text-primary dark:text-yellow-400 font-semibold"
        >
          あなたの魂の色彩を探しましょう
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300"
        >
          3分で終わる、ぞっとするほどの正確さ
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 sm:px-12 rounded-full text-lg sm:text-xl shadow-lg transition-all duration-300 min-h-[48px] touch-manipulation"
        >
          すぐにスタート
        </motion.button>
      </motion.div>
    </div>
  )
}
