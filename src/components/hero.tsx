import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.2),transparent_50%)]" />

      <div className="relative z-10 container px-4 mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-background/50 backdrop-blur-sm text-sm text-muted-foreground mb-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Discover amazing events near you</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
          Your Ultimate
          <span className="text-primary block sm:inline"> Event Hub</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Create, discover, and manage events effortlessly. From intimate
          gatherings to grand conferences — everything in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/events">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
              <Calendar className="h-5 w-5" />
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            ["10K+", "Events Hosted"],
            ["5K+", "Active Users"],
            ["50+", "Categories"],
          ].map(([stat, label]) => (
            <div key={label} className="rounded-xl border bg-background/50 backdrop-blur-sm p-4">
              <div className="text-2xl font-bold text-primary">{stat}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
