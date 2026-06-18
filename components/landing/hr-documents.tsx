"use client"

import { motion } from "motion/react"
import { FileSignature, FileBadge, ReceiptText, type LucideIcon } from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

type DocCard = {
  icon: LucideIcon
  title: string
  desc: string
  tag: string
}

const docs: DocCard[] = [
  {
    icon: FileSignature,
    title: "Offer Letter Generation",
    desc: "Generate customizable PDF offer letters with company branding, salary details, and joining information.",
    tag: "PDF",
  },
  {
    icon: FileBadge,
    title: "Experience Letter Generation",
    desc: "Create professional relieving and experience letters using reusable templates.",
    tag: "PDF",
  },
  {
    icon: ReceiptText,
    title: "Payslip Generator",
    desc: "Automatically generate monthly salary slips with earnings, deductions, and net pay calculations.",
    tag: "PDF",
  },
]

export function HrDocuments() {
  return (
    <section id="documents" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            HR Automation
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Automated HR Documentation
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Generate professional employment documents instantly.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <StaggerItem key={doc.title}>
              <motion.div
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur hover:border-accent/40 hover:shadow-[0_18px_40px_-18px_var(--color-emerald)]"
              >
                {/* emerald glow */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <doc.icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                    {doc.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-primary">
                  {doc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {doc.desc}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
