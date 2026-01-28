'use client'

import { motion } from 'framer-motion'
import { MBTI_COLORS, MBTIColorKey } from '@/utils/mbtiColors'

interface EnergyBallProps {
  startX: number
  startY: number
  endX: number
  endY: number
  color: MBTIColorKey
  animal: string
  onComplete: () => void
}

export default function EnergyBall({
  startX,
  startY,
  endX,
  endY,
  color,
  animal,
  onComplete,
}: EnergyBallProps) {
  // 只保留emoji飞起来的效果，取消所有光球和烟花设计
  return (
    <motion.div
      className="absolute flex items-center justify-center pointer-events-none"
      style={{
        left: startX,
        top: startY,
      }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{
        x: endX - startX,
        y: endY - startY,
        scale: [1, 1.2, 0.8, 0],
        opacity: [1, 1, 0.9, 0],
      }}
      transition={{
        duration: 0.6 + Math.random() * 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onAnimationComplete={onComplete}
    >
      {/* 只显示emoji，带旋转和缩放动画 */}
      <motion.span
        className="text-3xl select-none"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.2, 1, 0.8],
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      >
        {animal}
      </motion.span>
    </motion.div>
  )
}
