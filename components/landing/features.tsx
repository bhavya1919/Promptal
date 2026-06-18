"use client"

import { motion } from "motion/react"
import {
  Activity,
  Users2,
  Plug,
  Bell,
  FileCheck,
  Code2,
  Globe,
  Lock,
} from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

const features = [
  { icon: Activity, title: "Real-Time Analytics", desc: "Track pipeline health and hiring velocity live." },
  { icon: Users2, title: "Bulk Hiring", desc: "Screen and shortlist for hundreds of roles at once." },
  { icon: Plug, title: "Integration Hub", desc: "Connect your ATS, calendar, and email tools." },
  { icon: Bell, title: "Smart Notifications", desc: "Get alerted the moment a strong match appears." },
  { icon: FileCheck, title: "Compliance Manager", desc: "Stay audit-ready with built-in compliance checks." },
  { icon: Code2, title: "API Access", desc: "Build custom workflows on our developer-first API." },
  { icon: Globe, title: "Global Talent Pool", desc: "Source and match candidates across regions." },
  { icon: Lock, title: "Enterprise Security", desc: "SOC 2-grade encryption and role-based access." },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Features
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Everything you need to hire smarter
          </h2>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="group h-full rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-accent/40 hover:shadow-[0_18px_40px_-18px_var(--color-emerald)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-primary">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
