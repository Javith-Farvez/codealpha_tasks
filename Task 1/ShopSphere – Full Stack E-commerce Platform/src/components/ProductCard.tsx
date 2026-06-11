import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { inr } from "@/lib/format";

export type Product = {
  id: string;
  title: string;
  price: number;
  mrp: number | null;
  image_url: string;
  rating: number | null;
  brand: string | null;
};

export function ProductCard({ p }: { p: Product }) {
  const off = p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="aspect-square bg-secondary/30 flex items-center justify-center p-4">
        <img src={p.image_url} alt={p.title} loading="lazy" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">{p.brand}</p>
        <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{p.title}</h3>
        <div className="flex items-center gap-1 text-xs">
          <span className="bg-success text-success-foreground px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
            {p.rating ?? 4.0} <Star className="size-3 fill-current" />
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold">{inr(Number(p.price))}</span>
          {off > 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through">{inr(Number(p.mrp))}</span>
              <span className="text-xs text-success font-medium">{off}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
