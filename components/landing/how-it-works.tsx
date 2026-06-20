"use client"

import { motion } from "motion/react"
import { UserPlus, Upload, Sparkles } from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up",
    desc: "Create your Promtal workspace in minutes — no credit card required to start.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Upload Jobs & Resumes",
    desc: "Add your open roles and import candidate resumes in bulk, any format.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Get AI Matches",
    desc: "Receive ranked, bias-free matches with detailed scoring instantly.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            How It Works
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Up and running in three steps
          </h2>
        </Reveal>

        <RevealStagger className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s) => (
            <StaggerItem key={s.step}>
              <div className="relative flex flex-col items-center text-center">
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 17 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
                >
                  <s.icon className="h-7 w-7 text-accent" />
                </motion.span>
                <span className="mt-5 text-sm font-bold tracking-widest text-accent">
                  STEP {s.step}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-primary">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
