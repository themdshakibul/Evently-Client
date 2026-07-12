"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts: Record<string, { title: string; content: string; date: string; readTime: string; author: string; image: string }> = {
  "hosting-successful-virtual-event": {
    title: "10 Tips for Hosting a Successful Virtual Event",
    date: "Jun 15, 2024",
    readTime: "5 min read",
    author: "Sarah Johnson",
    image: "bg-gradient-to-br from-indigo-500 to-violet-600",
    content: `Virtual events have become a cornerstone of modern event strategy. Whether you're hosting a webinar, virtual conference, or online workshop, these tips will help you create an engaging experience.

1. Choose the Right Platform
Select a platform that matches your event's needs. Consider features like breakout rooms, polls, Q&A, and networking capabilities.

2. Test Your Technology
Run thorough tests before the event. Check audio, video, screen sharing, and internet connectivity. Have a backup plan ready.

3. Engage Your Audience
Use interactive elements like polls, quizzes, and live Q&A sessions. Keep your audience involved throughout the event.

4. Professional Production
Invest in good lighting, audio equipment, and a clean background. Quality matters in virtual events.

5. Create Networking Opportunities
Facilitate connections through breakout rooms, virtual coffee chats, and networking sessions.

6. Provide Clear Instructions
Send detailed instructions to attendees before the event. Include login links, schedules, and technical requirements.

7. Record Your Event
Record the event for attendees who couldn't join live. This also serves as valuable content for future promotion.

8. Follow Up
Send a follow-up email with recordings, slides, and additional resources. Gather feedback through surveys.

9. Promote Effectively
Use email marketing, social media, and partnerships to reach your target audience. Start promotion early.

10. Analyze and Improve
Review attendance data, engagement metrics, and feedback to improve future events.`,
  },
  "future-of-hybrid-events": {
    title: "The Future of Hybrid Events: Trends to Watch",
    date: "Jun 10, 2024",
    readTime: "7 min read",
    author: "Michael Chen",
    image: "bg-gradient-to-br from-cyan-500 to-blue-600",
    content: `Hybrid events are redefining the event industry. Here are the key trends shaping their future.

The Rise of Hybrid Events
As we move forward, hybrid events are becoming the new standard. Combining in-person and virtual elements offers the best of both worlds.

Key Trends:
- AI-powered networking matching
- Virtual reality venue tours
- Real-time translation services
- Integrated analytics across platforms
- Sustainable event practices`,
  },
};

export function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-2xl font-bold mb-2">Post not found</h1>
        <p className="text-muted-foreground mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/blog">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <div className={`h-64 sm:h-80 rounded-2xl ${post.image} mb-8`} />

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          </div>

          <div className="prose prose-sm sm:prose max-w-none">
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5.") || line.startsWith("6.") || line.startsWith("7.") || line.startsWith("8.") || line.startsWith("9.") || line.startsWith("10.")) {
                return <p key={i} className="mb-3 text-muted-foreground leading-relaxed">{line}</p>;
              }
              if (!line.trim()) return <br key={i} />;
              return <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{line}</p>;
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
