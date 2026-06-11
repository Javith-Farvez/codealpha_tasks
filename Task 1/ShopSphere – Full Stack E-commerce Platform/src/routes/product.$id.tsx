import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useCart();

  const { data: p, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <PageShell><p>Loading…</p></PageShell>;
  if (!p) return <PageShell><p>Product not found.</p></PageShell>;

  const off = p.mrp && Number(p.mrp) > Number(p.price)
    ? Math.round(((Number(p.mrp) - Number(p.price)) / Number(p.mrp)) * 100) : 0;

  const buyNow = async () => {
    if (!user) { navigate({ to: "/auth" }); return; }
    await cart.add.mutateAsync({ productId: p.id });
    navigate({ to: "/checkout" });
  };

  return (
    <PageShell>
      <div className="grid md:grid-cols-2 gap-8 bg-card border rounded-lg p-6">
        <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center p-8">
          <img src={p.image_url} alt={p.title} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{p.brand} • {p.category}</p>
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-success text-success-foreground px-2 py-0.5 rounded text-sm flex items-center gap-1 font-medium">
              {p.rating} <Star className="size-3 fill-current" />
            </span>
            <span className="text-sm text-muted-foreground">In stock: {p.stock}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{inr(Number(p.price))}</span>
            {off > 0 && (
              <>
                <span className="text-muted-foreground line-through">{inr(Number(p.mrp))}</span>
                <span className="text-success font-semibold">{off}% off</span>
              </>
            )}
          </div>
          <p className="text-sm text-foreground/80">{p.description}</p>

          <div className="grid grid-cols-3 gap-3 my-3 text-xs">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck className="size-5 text-primary" /><span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw className="size-5 text-primary" /><span>7-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck className="size-5 text-primary" /><span>Secure Payment</span>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              onClick={() => user ? cart.add.mutate({ productId: p.id }) : navigate({ to: "/auth" })}
            >
              Add to Cart
            </Button>
            <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:opacity-90" onClick={buyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
