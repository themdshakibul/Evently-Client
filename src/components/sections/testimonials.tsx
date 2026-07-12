import { SectionHeader } from "@/components/section-header";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Organizer",
    avatar: "SJ",
    content:
      "Evently made organizing our annual conference a breeze. The registration system and attendee management are top-notch.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Attendee",
    avatar: "MC",
    content:
      "I've discovered so many amazing events through Evently. The recommendation system is incredibly accurate.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Community Manager",
    avatar: "ER",
    content:
      "Our community events have seen a 300% increase in attendance since we started using Evently. Highly recommended!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    avatar: "DK",
    content:
      "The networking events I found through Evently helped me connect with investors and partners. Game changer!",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="What Our Users Say"
          description="Join thousands of satisfied users who trust Evently."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border bg-background p-6 flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "fill-primary text-primary" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground flex-1">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
