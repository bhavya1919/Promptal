"use client"

import { motion } from "motion/react"
import {
  UserPlus,
  IdCard,
  Upload,
  Send,
  Gauge,
  BellRing,
  Video,
  FileSignature,
  Building2,
  Megaphone,
  ClipboardList,
  ListChecks,
  Users2,
  CalendarClock,
  FileCheck2,
  UserCheck,
  type LucideIcon,
} from "lucide-react"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"

type Step = { icon: LucideIcon; label: string }

const candidateJourney: Step[] = [
  { icon: UserPlus, label: "Sign Up" },
  { icon: IdCard, label: "Create Profile" },
  { icon: Upload, label: "Upload Resume" },
  { icon: Send, label: "Apply for Job" },
  { icon: Gauge, label: "Get AI Match Score" },
  { icon: BellRing, label: "Receive Shortlist Update" },
  { icon: Video, label: "Attend Interview" },
  { icon: FileSignature, label: "Receive Offer Letter" },
]

const recruiterJourney: Step[] = [
  { icon: Building2, label: "Create Company Profile" },
  { icon: Megaphone, label: "Post Job" },
  { icon: ClipboardList, label: "Review Applications" },
  { icon: ListChecks, label: "View AI Rankings" },
  { icon: Users2, label: "Shortlist Candidates" },
  { icon: CalendarClock, label: "Schedule Interviews" },
  { icon: FileCheck2, label: "Generate Offer Letter" },
  { icon: UserCheck, label: "Onboard Employee" },
]

function JourneyColumn({
  title,
  tag,
  steps,
  variant,
}: {
  title: string
  tag: string
  steps: Step[]
  variant: "candidate" | "recruiter"
}) {
  const accent = variant === "candidate"
  return (
    <div className="relative rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <span
          className={
            accent
              ? "rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent"
              : "rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary"
          }
        >
          {tag}
        </span>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>

      <RevealStagger className="relative">
        {/* connecting line */}
        <span
          aria-hidden
          className="absolute left-[1.4rem] top-3 bottom-3 w-px bg-gradient-to-b from-border via-border to-transparent"
        />
        <ul className="space-y-4">
          {steps.map((step, i) => (
            <StaggerItem key={step.label}>
              <motion.li
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative flex items-center gap-4"
              >
                <span
                  className={
                    accent
                      ? "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
                      : "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-secondary/30 bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground"
                  }
                >
                  <step.icon className="h-5 w-5" />
                </span>
                <div className="flex flex-1 items-center justify-between rounded-xl border border-transparent bg-muted/40 px-4 py-3 transition-colors group-hover:border-border group-hover:bg-card">
                  <span className="text-sm font-medium text-primary">
                    {step.label}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.li>
            </StaggerItem>
          ))}
        </ul>
      </RevealStagger>
    </div>
  )
}

export function HiringWorkflow() {
  return (
    <section id="workflow" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Hiring Workflow
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            End-to-End Hiring Workflow
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            From application to offer letter, Promtal streamlines the entire
            recruitment lifecycle.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <JourneyColumn
              title="Candidate Journey"
              tag="Candidate"
              steps={candidateJourney}
              variant="candidate"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <JourneyColumn
              title="Recruiter Journey"
              tag="Recruiter"
              steps={recruiterJourney}
              variant="recruiter"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
