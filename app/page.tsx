import { BackgroundGlow } from "@/components/landing/background-glow"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Trust } from "@/components/landing/trust"
import { Problems } from "@/components/landing/problems"
import { Solutions } from "@/components/landing/solutions"
import { AiMatching } from "@/components/landing/ai-matching"
import { AiMatchingDemo } from "@/components/landing/ai-matching-demo"
import { HowItWorks } from "@/components/landing/how-it-works"
import { HiringWorkflow } from "@/components/landing/hiring-workflow"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { PlatformUsers } from "@/components/landing/platform-users"
import { Features } from "@/components/landing/features"
import { HrDocuments } from "@/components/landing/hr-documents"
import { Metrics } from "@/components/landing/metrics"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundGlow />
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <Problems />
        <Solutions />
        <AiMatching />
        <AiMatchingDemo />
        <HowItWorks />
        <HiringWorkflow />
        <DashboardPreview />
        <PlatformUsers />
        <Features />
        <HrDocuments />
        <Metrics />
        <Testimonials />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
