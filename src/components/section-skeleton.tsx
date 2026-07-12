export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={`space-y-4 animate-pulse ${className || ""}`}>
      <div className="h-8 w-48 bg-muted rounded mx-auto" />
      <div className="h-4 w-72 bg-muted rounded mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}
