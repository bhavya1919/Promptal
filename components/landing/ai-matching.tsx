"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { X, Check } from "lucide-react"
import { Reveal } from "./reveal"

const traditional = [
  "Manual resume scanning",
  "Keyword-only filtering",
  "Days to shortlist",
  "Prone to human bias",
]

const promtal = [
  "AI contextual screening",
  "Skill & intent matching",
  "Seconds to shortlist",
  "Objective, bias-free scoring",
]

export function AiMatching() {
  return (
    <section
      id="ai-matching"
      className="bg-primary py-20 text-primary-foreground sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            AI Matching Engine
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Traditional hiring vs. Promtal AI
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/70">
            Our engine evaluates skills, experience, and intent to surface your best
            matches — instantly.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Traditional */}
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-primary-foreground/80">
                Traditional Recruitment
              </h3>
              <ul className="mt-5 space-y-3">
                {traditional.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-primary-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Circular indicator */}
          <Reveal delay={0.15}>
            <AccuracyRing />
          </Reveal>

          {/* Promtal */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6">
              <h3 className="text-lg font-semibold text-accent">Promtal AI</h3>
              <ul className="mt-5 space-y-3">
                {promtal.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-primary-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function AccuracyRing() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const target = 0.95

  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
      <svg ref={ref} className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-white/10"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--color-emerald)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            inView ? { strokeDashoffset: circumference * (1 - target) } : {}
          }
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-accent">95%</span>
        <span className="mt-1 text-xs uppercase tracking-wide text-primary-foreground/60">
          Match Accuracy
        </span>
      </div>
    </div>
  )
}
