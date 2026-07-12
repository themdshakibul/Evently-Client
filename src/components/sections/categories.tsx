import { SectionHeader } from "@/components/section-header";
import { SectionSkeleton } from "@/components/section-skeleton";
import {
  Music,
  GraduationCap,
  Briefcase,
  Heart,
  Utensils,
  Gamepad2,
  Palette,
  Trophy,
} from "lucide-react";

const categories = [
  { icon: Music, label: "Music", count: "245 events" },
  { icon: GraduationCap, label: "Education", count: "189 events" },
  { icon: Briefcase, label: "Business", count: "312 events" },
  { icon: Heart, label: "Health", count: "98 events" },
  { icon: Utensils, label: "Food & Drink", count: "156 events" },
  { icon: Gamepad2, label: "Gaming", count: "87 events" },
  { icon: Palette, label: "Art & Culture", count: "134 events" },
  { icon: Trophy, label: "Sports", count: "203 events" },
];

export function Categories() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Browse by Category"
          description="Find the perfect event from a wide range of categories."
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-4 rounded-xl border bg-background p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSkeleton() {
  return <SectionSkeleton />;
}
