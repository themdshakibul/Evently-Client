import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Calendar, Clock } from "lucide-react";

const posts = [
  {
    slug: "hosting-successful-virtual-event",
    title: "10 Tips for Hosting a Successful Virtual Event",
    excerpt: "Learn the best practices for engaging virtual audiences and creating memorable online experiences.",
    date: "Jun 15, 2024",
    readTime: "5 min read",
    author: "Sarah Johnson",
    image: "bg-gradient-to-br from-indigo-500 to-violet-600",
  },
  {
    slug: "future-of-hybrid-events",
    title: "The Future of Hybrid Events: Trends to Watch",
    excerpt: "Discover how hybrid events are reshaping the event industry and what to expect in 2024.",
    date: "Jun 10, 2024",
    readTime: "7 min read",
    author: "Michael Chen",
    image: "bg-gradient-to-br from-cyan-500 to-blue-600",
  },
  {
    slug: "choose-perfect-venue",
    title: "How to Choose the Perfect Venue for Your Event",
    excerpt: "A comprehensive guide to selecting venues that match your event goals and budget.",
    date: "Jun 5, 2024",
    readTime: "4 min read",
    author: "Emily Rodriguez",
    image: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    slug: "marketing-your-event",
    title: "Marketing Your Event: A Step-by-Step Guide",
    excerpt: "Effective strategies to promote your event and maximize attendance across all channels.",
    date: "May 28, 2024",
    readTime: "6 min read",
    author: "David Kim",
    image: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    slug: "event-budgeting-tips",
    title: "Event Budgeting: How to Plan and Save",
    excerpt: "Master the art of event budgeting with these practical tips and templates.",
    date: "May 20, 2024",
    readTime: "5 min read",
    author: "Sarah Johnson",
    image: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    slug: "networking-event-ideas",
    title: "Creative Networking Event Ideas That Actually Work",
    excerpt: "Break the ice and foster meaningful connections with these innovative networking formats.",
    date: "May 15, 2024",
    readTime: "4 min read",
    author: "Michael Chen",
    image: "bg-gradient-to-br from-teal-500 to-cyan-600",
  },
];

export function BlogListPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Our Blog"
          description="Insights, tips, and guides for event organizers and attendees."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border bg-background overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-44 ${post.image}`} />
              <div className="p-5 space-y-3">
                <h2 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">By {post.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
