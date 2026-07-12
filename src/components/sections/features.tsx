import { SectionHeader } from "@/components/section-header";
import { Calendar, Globe, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Event Creation",
    description: "Create and publish events in minutes with our intuitive form and rich text editor.",
  },
  {
    icon: Globe,
    title: "Discover Events",
    description: "Browse hundreds of events with powerful search, filters, and personalized recommendations.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Safe and secure registration with verified organizers and payment protection.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get instant notifications for event changes, reminders, and new opportunities.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Everything you need"
          description="Powerful features to help you create, discover, and manage events seamlessly."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border bg-background p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
