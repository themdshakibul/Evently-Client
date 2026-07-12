"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  "All", "Music", "Education", "Business", "Health",
  "Food & Drink", "Gaming", "Art & Culture", "Sports",
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const allEvents = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  title: ([
    "Tech Innovation Summit", "Summer Music Festival", "Startup Networking Night",
    "Art & Design Workshop", "Health & Wellness Expo", "Food Truck Festival",
    "Gaming Tournament 2024", "Photography Masterclass", "Charity Gala Dinner",
    "Yoga Retreat Weekend", "AI Conference 2024", "Wine Tasting Experience",
    "Comedy Night Live", "Marathon 2024", "Cooking Class with Chef",
    "Book Club Meeting", "Dance Workshop", "Film Screening Night",
    "Entrepreneurship Bootcamp", "Meditation Session", "Hackathon 2024",
    "Fashion Show", "Pet Adoption Event", "Science Fair",
    "Blockchain Summit", "Jazz Night", "Startup Pitch Day", "Fitness Bootcamp",
    "Wine & Paint Night", "Robotics Workshop", "Poetry Slam", "Coding Bootcamp",
    "Farmers Market", "Stand-up Special", "Data Science Conf", "Board Game Night",
    "Photography Walk", "Vegan Cooking Class", "Career Fair", "Open Mic Night",
    "Design Thinking Workshop", "Film Festival", "Brewery Tour", "Yoga in the Park",
    "Cybersecurity Summit", "Pottery Class", "Wine Club Meeting", "Dance Battle",
  ])[i],
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  location: (["San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL", "Miami, FL", "Seattle, WA", "Denver, CO", "Portland, OR"])[Math.floor(Math.random() * 8)],
  price: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 10 : 0,
  attendees: Math.floor(Math.random() * 1000) + 50,
  image: `bg-gradient-to-br from-${["blue", "pink", "emerald", "amber", "purple", "cyan"][Math.floor(Math.random() * 6)]}-500 to-${["purple", "rose", "teal", "orange", "indigo", "blue"][Math.floor(Math.random() * 6)]}-600`,
}));

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const ITEMS_PER_PAGE = 12;

  const updateURL = useCallback((params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== "All") sp.set(k, v);
      else sp.delete(k);
    });
    router.replace(`/events?${sp.toString()}`, { scroll: false });
  }, [router, searchParams]);

  useEffect(() => {
    updateURL({ search: debouncedSearch, category, sort, location });
  }, [debouncedSearch, category, sort, location, updateURL]);

  let filtered = allEvents.filter((e) => {
    if (debouncedSearch && !e.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
    if (category !== "All" && e.category !== category) return false;
    if (location && !e.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  if (sort === "oldest") filtered = [...filtered].reverse();
  else if (sort === "popular") filtered = [...filtered].sort((a, b) => b.attendees - a.attendees);
  else if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const visibleEvents = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [debouncedSearch, category, sort, location]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
            setLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("");
    setSort("newest");
    router.replace("/events", { scroll: false });
  };

  const activeFilters: { label: string; onClear: () => void }[] = [];
  if (search) activeFilters.push({ label: `"${search}"`, onClear: () => { setSearch(""); setCategory("All"); } });
  if (category !== "All") activeFilters.push({ label: category, onClear: () => setCategory("All") });
  if (location) activeFilters.push({ label: location, onClear: () => setLocation("") });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Events</h1>
          <p className="text-muted-foreground mt-1">Discover events that match your interests.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button
            variant="outline"
            className="lg:hidden gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {activeFilters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {f.label}
                <button onClick={f.onClear} className="hover:bg-primary/20 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground ml-1">
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {showFilters && (
            <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowFilters(false)}>
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )}

          <aside className={`lg:w-64 shrink-0 space-y-5 ${showFilters ? "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r p-6 overflow-y-auto shadow-xl" : "hidden lg:block"}`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 rounded-md hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setVisibleCount(ITEMS_PER_PAGE); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      category === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-input hover:border-primary/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                placeholder="City or region..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {activeFilters.length > 0 && (
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={clearFilters}>
                <X className="h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </aside>

          <div className="flex-1">
            {visibleEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {visibleEvents.length} of {filtered.length} events
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group rounded-xl border bg-background overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className={`h-32 ${event.image} flex items-center justify-center`}>
                        <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          {event.date} &middot; {event.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                          <span className="text-xs font-semibold">
                            {event.price === 0 ? "Free" : `$${event.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div ref={loaderRef} className="flex items-center justify-center py-8">
                    {loadingMore ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more events...
                      </div>
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
