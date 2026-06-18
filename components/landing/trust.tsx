"use client"

import { Reveal } from "./reveal"

const companies = ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro"]

export function Trust() {
  return (
    <section className="border-y border-border bg-background/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by Industry Leaders
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
            {companies.map((name) => (
              <span
                key={name}
                className="text-xl font-bold tracking-tight text-primary/40 transition-colors hover:text-primary/70 sm:text-2xl"
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
