"use client"

import { motion } from "motion/react"
import { User, Briefcase, ShieldCheck } from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Dashboard Preview
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Built for every role on your team
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Tailored views for candidates, recruiters, and admins — all in one place.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 lg:grid-cols-3">
          <StaggerItem>
            <Mock title="Candidate View" icon={User} accent="secondary">
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/60 p-3">
                  <div className="text-xs text-muted-foreground">Application Status</div>
                  <div className="mt-1 text-sm font-semibold text-primary">
                    Shortlisted · 92% Match
                  </div>
                </div>
                <Bar label="Profile Strength" value={88} color="bg-secondary" />
                <Bar label="Skill Match" value={92} color="bg-accent" />
              </div>
            </Mock>
          </StaggerItem>

          <StaggerItem>
            <Mock title="Recruiter View" icon={Briefcase} accent="accent" featured>
              <div className="space-y-2">
                {[
                  ["A. Sharma", 96],
                  ["M. Chen", 91],
                  ["L. Gomez", 87],
                ].map(([name, score]) => (
                  <div
                    key={name as string}
                    className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm"
                  >
                    <span className="text-primary">{name}</span>
                    <span className="font-semibold text-accent">{score}%</span>
                  </div>
                ))}
              </div>
            </Mock>
          </StaggerItem>

          <StaggerItem>
            <Mock title="Admin View" icon={ShieldCheck} accent="primary">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Active Jobs" value="248" />
                <Stat label="Recruiters" value="32" />
                <Stat label="Hires (MTD)" value="61" />
                <Stat label="Avg. Time" value="3.2d" />
              </div>
            </Mock>
          </StaggerItem>
        </RevealStagger>
      </div>
    </section>
  )
}

function Mock({
  title,
  icon: Icon,
  children,
  featured,
}: {
  title: string
  icon: typeof User
  accent: string
  featured?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`h-full overflow-hidden rounded-2xl border bg-card shadow-sm ${
        featured ? "border-accent/40 shadow-md" : "border-border"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="h-4 w-4 text-accent" />
        </span>
        <span className="text-sm font-semibold text-primary">{title}</span>
        <span className="ml-auto flex gap-1">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-accent/60" />
        </span>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  )
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-primary">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <div className="text-lg font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
