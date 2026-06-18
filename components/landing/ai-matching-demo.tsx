"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { Check, X, Sparkles } from "lucide-react"
import { Reveal } from "./reveal"

type Example = {
  requirements: string[]
  candidate: string[]
  score: number
}

const examples: Example[] = [
  {
    requirements: ["Python", "SQL", "Power BI"],
    candidate: ["Python", "SQL"],
    score: 67,
  },
  {
    requirements: ["Python", "SQL", "Power BI"],
    candidate: ["Python", "SQL", "Power BI"],
    score: 95,
  },
]

function ScoreRing({ score }: { score: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const target = score / 100
  const strong = score >= 80

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg ref={ref} className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          className="text-muted"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strong ? "var(--color-emerald)" : "var(--color-indigo)"}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference * (1 - target) } : {}}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={
            strong
              ? "text-3xl font-bold text-accent"
              : "text-3xl font-bold text-secondary"
          }
        >
          {score}%
        </span>
        <span className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Match
        </span>
      </div>
    </div>
  )
}

function SkillList({
  title,
  skills,
  matchAgainst,
}: {
  title: string
  skills: string[]
  matchAgainst?: string[]
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-2">
        {skills.map((skill) => {
          const matched = matchAgainst ? matchAgainst.includes(skill) : true
          return (
            <li key={skill} className="flex items-center gap-2.5 text-sm">
              <span
                className={
                  matched
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent"
                    : "flex h-5 w-5 items-center justify-center rounded-full bg-destructive/15 text-destructive"
                }
              >
                {matched ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </span>
              <span className="font-medium text-primary">{skill}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function MatchCard({ example, delay }: { example: Example; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur sm:p-8"
      >
        <div className="grid grid-cols-2 gap-6">
          <SkillList title="Job Requirements" skills={example.requirements} />
          <SkillList
            title="Candidate Skills"
            skills={example.candidate}
            matchAgainst={example.requirements}
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <div>
            <p className="text-sm font-semibold text-primary">Match Score</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {example.candidate.length} of {example.requirements.length} skills
              matched
            </p>
          </div>
          <ScoreRing score={example.score} />
        </div>
      </motion.div>
    </Reveal>
  )
}

export function AiMatchingDemo() {
  return (
    <section id="matching-demo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Matching Demo
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            AI-Powered Candidate Matching
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Our intelligent matching engine ranks candidates based on job
            requirements and skill compatibility.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            Keyword &amp; Skill-Based AI Ranking
          </span>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <MatchCard example={examples[0]} delay={0} />
          <MatchCard example={examples[1]} delay={0.1} />
        </div>
      </div>
    </section>
  )
}
