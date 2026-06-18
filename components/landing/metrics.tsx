"use client"

import { CountUp } from "./count-up"
import { RevealStagger, StaggerItem } from "./reveal"

const stats = [
  { to: 10000, suffix: "+", label: "Candidates Matched" },
  { to: 2000, suffix: "+", label: "Active Jobs" },
  { to: 500, suffix: "+", label: "Recruiters Using Platform" },
  { to: 95, suffix: "%", label: "AI Accuracy Rate" },
]

export function Metrics() {
  return (
    <section className="bg-secondary py-16 text-secondary-foreground sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealStagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <div className="text-4xl font-bold tracking-tight sm:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-secondary-foreground/80">{s.label}</div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
