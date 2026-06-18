"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal, RevealStagger, StaggerItem } from "./reveal"
import Link from "next/link"

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For small teams getting started with AI hiring.",
    features: [
      "Up to 3 active jobs",
      "100 resume screenings / mo",
      "Basic AI matching",
      "Email support",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Professional",
    price: "₹999",
    period: "/month",
    desc: "For growing teams that hire continuously.",
    features: [
      "Unlimited active jobs",
      "10,000 resume screenings / mo",
      "Advanced AI matching",
      "Smart analytics dashboard",
      "Priority support",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with advanced needs.",
    features: [
      "Everything in Professional",
      "Unlimited screenings",
      "SSO & compliance manager",
      "Dedicated success manager",
      "Custom API access",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Pricing
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid items-center gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <StaggerItem key={tier.name}>
              <motion.div
                whileHover={
                  tier.featured ? { scale: 1.08, y: -2 } : { y: -6 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                  tier.featured
                    ? "border-accent bg-primary text-primary-foreground shadow-xl"
                    : "border-border bg-card shadow-sm"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`text-lg font-semibold ${
                    tier.featured ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    tier.featured
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {tier.desc}
                </p>
                <div className="mt-5 flex items-end gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      tier.featured ? "text-accent" : "text-primary"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={`pb-1 text-sm ${
                      tier.featured
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tier.period}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.featured ? "text-accent" : "text-accent"
                        }`}
                      />
                      <span
                        className={
                          tier.featured
                            ? "text-primary-foreground/90"
                            : "text-foreground/80"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="mt-7 w-full block">
                  <Button
                    className={`w-full ${
                      tier.featured
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
