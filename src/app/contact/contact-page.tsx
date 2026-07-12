"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    console.log("Contact form:", data);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    reset();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-background p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    {...register("name")}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <input
                  {...register("subject")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="How can we help?"
                />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                  placeholder="Tell us more about your inquiry..."
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
              </div>

              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-background p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Email</h3>
                  <p className="text-sm text-muted-foreground mt-1">hello@evently.com</p>
                  <p className="text-sm text-muted-foreground">support@evently.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Phone</h3>
                  <p className="text-sm text-muted-foreground mt-1">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Office</h3>
                  <p className="text-sm text-muted-foreground mt-1">123 Event Street</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-background p-6">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Mon - Fri</span><span>9:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>10:00 AM - 4:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
