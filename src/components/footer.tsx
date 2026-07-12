import Link from "next/link";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Evently</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate event hub. Create, discover, and manage events effortlessly.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Explore Events
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@evently.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                123 Event St, NYC
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Evently. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
