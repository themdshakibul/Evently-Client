interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
