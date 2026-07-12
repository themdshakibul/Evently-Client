"use client";

import { SectionHeader } from "@/components/section-header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", events: 45 },
  { month: "Feb", events: 52 },
  { month: "Mar", events: 68 },
  { month: "Apr", events: 72 },
  { month: "May", events: 85 },
  { month: "Jun", events: 91 },
  { month: "Jul", events: 78 },
  { month: "Aug", events: 95 },
  { month: "Sep", events: 88 },
  { month: "Oct", events: 76 },
  { month: "Nov", events: 82 },
  { month: "Dec", events: 99 },
];

const categoryData = [
  { category: "Business", count: 312 },
  { category: "Music", count: 245 },
  { category: "Sports", count: 203 },
  { category: "Education", count: 189 },
  { category: "Food", count: 156 },
  { category: "Art", count: 134 },
];

export function Statistics() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Platform Statistics"
          description="See how Evently is growing month by month."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl border bg-background p-6">
            <h3 className="font-semibold mb-4">Events per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="events" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border bg-background p-6">
            <h3 className="font-semibold mb-4">Events by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatisticsSkeleton() {
  return (
    <div className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-3">
          <div className="h-8 w-48 bg-muted rounded mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[350px] bg-muted rounded-xl animate-pulse" />
          <div className="h-[350px] bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
