"use client"

import { motion } from "motion/react"
import { Sparkles, Play, ArrowRight, Users, Target, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const spring = { type: "spring", stiffness: 400, damping: 17 } as const

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm font-medium text-accent"
            >
              <Sparkles className="h-4 w-4" />
              Powered by Advanced AI
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-pretty text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl"
            >
              Transform Your Recruitment with{" "}
              <span className="text-accent">AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0"
            >
              Promtal Jobs screens thousands of resumes in seconds, removes hiring
              bias, and matches the right talent to the right role with unmatched
              accuracy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="group bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
              >
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group border-accent/40 bg-card text-primary transition-shadow hover:border-accent hover:shadow-[0_0_24px_-4px_var(--color-emerald)]"
                  >
                    <Play className="mr-1 h-4 w-4 text-accent" />
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-8 lg:justify-start"
            >
              <Metric icon={Users} value="10,000+" label="Candidates" />
              <span className="h-10 w-px bg-border" />
              <Metric icon={Target} value="95%" label="Match Accuracy" />
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="text-left">
        <div className="text-xl font-bold text-primary">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-emerald/5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-4 w-4 text-accent" />
            </span>
            <span className="text-sm font-semibold text-primary">AI Match Results</span>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
            Live
          </span>
        </div>

        <div className="space-y-3 pt-4">
          {[
            { name: "Senior Frontend Engineer", score: 96, color: "bg-accent" },
            { name: "Product Designer", score: 91, color: "bg-secondary" },
            { name: "Data Scientist", score: 88, color: "bg-accent" },
          ].map((row, i) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="rounded-xl border border-border bg-muted/50 p-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-primary">{row.name}</span>
                <span className="font-semibold text-accent">{row.score}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                <motion.div
                  className={`h-full rounded-full ${row.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.score}%` }}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 -top-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
      >
        <div className="text-2xl font-bold text-accent">95%</div>
        <div className="text-xs text-muted-foreground">Accuracy</div>
      </motion.div>
    </div>
  )
}
