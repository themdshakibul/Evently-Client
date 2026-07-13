import { SectionHeader } from "@/components/section-header";
import { Users, Target, Heart, Award } from "lucide-react";

const stats = [
  { label: "Events Hosted", value: "10K+" },
  { label: "Active Users", value: "5K+" },
  { label: "Cities Covered", value: "50+" },
  { label: "Happy Customers", value: "98%" },
];

const values = [
  { icon: Target, title: "Mission", description: "To connect people through meaningful events and make event management accessible to everyone." },
  { icon: Heart, title: "Community First", description: "We prioritize building a supportive community where organizers and attendees thrive together." },
  { icon: Award, title: "Quality", description: "Every event on our platform is verified to ensure the highest quality experience." },
  { icon: Users, title: "Inclusivity", description: "We believe great events should be accessible to all, regardless of background or location." },
];

const team = [
  { name: "Sarah Johnson", role: "CEO & Founder", avatar: "SJ" },
  { name: "Michael Chen", role: "CTO", avatar: "MC" },
  { name: "Emily Rodriguez", role: "Head of Design", avatar: "ER" },
  { name: "David Kim", role: "Head of Marketing", avatar: "DK" },
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Evently was born from a simple idea: make it effortless to create, discover, and manage events. 
            What started as a small project has grown into a platform serving thousands of event organizers 
            and attendees worldwide.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 border-y bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader title="Our Values" description="What drives us every day." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border bg-background p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader title="Meet Our Team" description="The people behind Evently." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mx-auto mb-4">
                  {t.avatar}
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
