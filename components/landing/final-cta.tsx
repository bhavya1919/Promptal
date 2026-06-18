"use client"

import { motion } from "motion/react"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "./reveal"

const spring = { type: "spring", stiffness: 400, damping: 17 } as const

export function FinalCta() {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
            <div className="pointer-events-none absolute -left-16 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to transform how you hire?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/70">
                Join thousands of teams using Promtal Jobs to find the right talent,
                faster and fairer.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                >
                  <Button
                    size="lg"
                    className="group bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Start Hiring
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10"
                  >
                    <Search className="mr-1 h-4 w-4" />
                    Find Jobs
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
