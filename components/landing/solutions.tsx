"use client"

import { motion } from "motion/react"
import {
  Zap,
  ShieldCheck,
  BarChart3,
  FileSignature,
  UserCircle,
  LayoutDashboard,
} from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

const solutions = [
  {
    icon: Zap,
    title: "Instant Screening",
    desc: "Parse and rank thousands of resumes in seconds with AI that understands context, not just keywords.",
  },
  {
    icon: ShieldCheck,
    title: "Bias-Free Matching",
    desc: "Objective, skill-first scoring removes unconscious bias so the best candidate always rises.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Real-time insights into your pipeline, sources, and hiring velocity at a glance.",
  },
  {
    icon: FileSignature,
    title: "Offer Generation",
    desc: "Auto-generate compliant, personalized offer letters and send them in one click.",
  },
  {
    icon: UserCircle,
    title: "Candidate Portal",
    desc: "A polished experience that keeps applicants engaged and informed at every stage.",
  },
  {
    icon: LayoutDashboard,
    title: "Recruiter Dashboard",
    desc: "Everything your team needs — jobs, candidates, and matches — in one unified workspace.",
  },
]

export function Solutions() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            The Solution
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            One platform for smarter hiring
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Promtal Jobs replaces the chaos with an intelligent, end-to-end
            recruitment engine.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <StaggerItem key={s.title}>
              <motion.div
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur hover:border-accent/40 hover:shadow-[0_18px_40px_-18px_var(--color-emerald)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
