import { Hero } from "@/components/hero";
import { Features } from "@/components/sections/features";
import { Categories } from "@/components/sections/categories";
import { FeaturedEvents } from "@/components/sections/featured-events";
import { Statistics } from "@/components/sections/statistics";
import { Testimonials } from "@/components/sections/testimonials";
import { Blog } from "@/components/sections/blog";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <FeaturedEvents />
      <Statistics />
      <Testimonials />
      <Blog />
      <FAQ />
    </>
  );
}
