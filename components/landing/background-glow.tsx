"use client"

import { useScroll, useTransform, motion } from "motion/react"

export function BackgroundGlow() {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 140])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-secondary/10 blur-[130px]"
      />
    </div>
  )
}
