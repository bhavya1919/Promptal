"use client"

import { motion } from "motion/react"
import { Sparkles, Send, AtSign, Globe } from "lucide-react"

const columns = [
  {
    title: "Product",
    links: ["Features", "AI Matching", "Dashboard", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Help Center", "API", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
]

const socials = [
  { icon: Send, label: "Twitter" },
  { icon: AtSign, label: "LinkedIn" },
  { icon: Globe, label: "GitHub" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5 text-accent" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-primary">
                Promtal<span className="text-accent"> Jobs</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered recruitment that helps you hire the right talent, faster and
              without bias.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-accent"
                >
                  <s.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-primary">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="inline-block text-sm text-muted-foreground transition-all hover:translate-x-1 hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Promtal Jobs. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with care for modern hiring teams.
          </p>
        </div>
      </div>
    </footer>
  )
}
