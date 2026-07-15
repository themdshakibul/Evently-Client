"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import Link from "next/link";

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

interface EventItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  views: number;
  images: string[];
  attendees?: number; // fallback if needed
  capacity: number;
}

interface EventsResponse {
  success: boolean;
  data: EventItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const fetchEvents = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const currentPage = isLoadMore ? page + 1 : 1;
      
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category !== "All") params.set("category", category);
      if (sort) params.set("sort", sort);
      if (location) params.set("location", location);
      params.set("page", currentPage.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());

      const res = await apiClient<EventsResponse>(`/events?${params.toString()}`);
      
      if (isLoadMore) {
        setEvents(prev => [...prev, ...res.data]);
        setPage(currentPage);
      } else {
        setEvents(res.data);
        setPage(1);
      }
      
      setTotalEvents(res.total);
      setHasMore(currentPage < res.totalPages);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, category, sort, location, page]);

  useEffect(() => {
    fetchEvents(false);
  }, [debouncedSearch, category, sort, location, fetchEvents]); // trigger on filter change

  useEffect(() => {
    if (!loaderRef.current || !hasMore || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchEvents(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, fetchEvents]);

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
              onChange={(e) => setSearch(e.target.value)}
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
                    onClick={() => setCategory(c)}
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
                onChange={(e) => setLocation(e.target.value)}
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
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-52 bg-muted rounded-xl" />
                ))}
               </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {events.length} of {totalEvents} events
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {events.map((event) => (
                    <Link href={`/events/${event._id}`} key={event._id}>
                      <div className="group h-full rounded-xl border bg-background overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        {event.images && event.images.length > 0 ? (
                          <div className="relative h-40 overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundImage: `url(${event.images[0]})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="relative h-full flex items-start justify-end p-3">
                              <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium shadow-sm">
                                {event.category}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-start justify-end p-3">
                            <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium shadow-sm">
                              {event.category}
                            </span>
                          </div>
                        )}
                        <div className="p-3 space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} &middot; {event.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{event.views || 0} views</span>
                            <span className="text-xs font-semibold">
                              {event.price === 0 ? "Free" : `$${event.price}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
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
