import { Star, Quote } from "lucide-react";

interface Review { name: string; year: string; rating: number; text: string }

export function ReviewsBlock({ reviews }: { reviews: Review[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {reviews.map((r, i) => (
        <figure key={i} className="relative rounded-xl border bg-card p-4 shadow-soft">
          <Quote className="absolute right-3 top-3 h-4 w-4 text-primary/30" />
          <div className="mb-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className={`h-3 w-3 ${j < r.rating ? "fill-warning text-warning" : "text-muted"}`} />
            ))}
          </div>
          <blockquote className="text-xs leading-relaxed text-foreground">"{r.text}"</blockquote>
          <figcaption className="mt-3 text-[11px] text-muted-foreground">{r.name} · {r.year}</figcaption>
        </figure>
      ))}
    </div>
  );
}
