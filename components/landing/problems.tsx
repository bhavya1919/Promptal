"use client"

import { motion } from "motion/react"
import { FileStack, Scale, Clock, TrendingUp } from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

const problems = [
  {
    icon: FileStack,
    title: "Endless Resumes, Limited Time",
    desc: "Recruiters spend hours manually scanning hundreds of resumes for every single open role.",
  },
  {
    icon: Scale,
    title: "Hiring Bias & Wrong Matches",
    desc: "Unconscious bias and gut-feel decisions lead to costly mis-hires and missed talent.",
  },
  {
    icon: Clock,
    title: "Slow Decision Making",
    desc: "Lengthy review cycles mean top candidates accept offers elsewhere before you respond.",
  },
  {
    icon: TrendingUp,
    title: "Recruitment Costs Spiral",
    desc: "Job boards, agencies, and wasted hours quietly inflate your cost-per-hire every quarter.",
  },
]

export function Problems() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-destructive">
            The Problem
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Hiring is harder than it should be
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Traditional recruitment is slow, biased, and expensive. Here&apos;s what
            stands between you and great hires.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
