"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I create an event?",
    a: "Sign up for an account, click 'Add Event' in your dashboard, fill in the event details, and publish. Your event will be live instantly.",
  },
  {
    q: "Is Evently free to use?",
    a: "Yes! Creating an account and browsing events is completely free. Premium features for organizers are coming soon.",
  },
  {
    q: "Can I cancel my registration?",
    a: "Yes, you can cancel your registration from your account dashboard. Refund policies depend on the individual event organizer.",
  },
  {
    q: "How do I get a refund?",
    a: "Contact the event organizer directly through the event page. Refunds are handled on a per-event basis.",
  },
  {
    q: "How are events verified?",
    a: "All organizers go through a verification process. We review event listings to ensure quality and accuracy.",
  },
  {
    q: "Can I promote my event?",
    a: "Yes! Featured event placements and promotional tools are available. Check your organizer dashboard for options.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <SectionHeader
          title="Frequently Asked Questions"
          description="Got questions? We've got answers."
        />
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border bg-background overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""
                    }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
