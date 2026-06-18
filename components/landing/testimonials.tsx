"use client"

import { motion } from "motion/react"
import { Star } from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

const testimonials = [
  {
    quote:
      "Promtal cut our time-to-shortlist from days to minutes. The match quality is genuinely better than our senior recruiters' picks.",
    name: "Ananya Rao",
    role: "Head of Talent, NexaSoft",
    initials: "AR",
  },
  {
    quote:
      "We screened 4,000 applicants for a hiring drive without breaking a sweat. The bias-free scoring gave us a more diverse pipeline too.",
    name: "Daniel Mercer",
    role: "VP People, Brightwave",
    initials: "DM",
  },
  {
    quote:
      "The analytics alone justify the cost. We finally understand where our best hires come from and doubled down on it.",
    name: "Priya Nair",
    role: "Recruitment Lead, Cloudpeak",
    initials: "PN",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Testimonials
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Loved by hiring teams everywhere
          </h2>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md"
              >
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-pretty leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {t.initials}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-primary">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
