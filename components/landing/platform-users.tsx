"use client"

import { motion } from "motion/react"
import { Check, UserCircle, Briefcase, ShieldCheck, type LucideIcon } from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

type Persona = {
  icon: LucideIcon
  title: string
  features: string[]
}

const personas: Persona[] = [
  {
    icon: UserCircle,
    title: "Candidates",
    features: [
      "Search Jobs",
      "Apply Online",
      "Track Application Status",
      "Attend Interviews",
      "Receive Offer Letters",
    ],
  },
  {
    icon: Briefcase,
    title: "Recruiters",
    features: [
      "Create Company Profile",
      "Post Jobs",
      "Review Applications",
      "AI Candidate Ranking",
      "Schedule Interviews",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    features: [
      "Manage Companies",
      "Manage Recruiters",
      "Monitor Applications",
      "Access HR Documents",
      "Platform Oversight",
    ],
  },
]

export function PlatformUsers() {
  return (
    <section id="users" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Platform Users
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Built for Every Hiring Stakeholder
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            One platform that adapts to candidates, recruiters, and administrators
            alike.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur hover:border-accent/40 hover:shadow-[0_18px_40px_-18px_var(--color-emerald)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-accent/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary text-accent-foreground shadow-sm">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">
                  {p.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
