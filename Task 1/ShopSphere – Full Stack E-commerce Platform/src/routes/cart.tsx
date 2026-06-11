import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { items, subtotal, updateQty, remove, isLoading } = useCart();

  if (loading) return <Shell><p>Loading…</p></Shell>;
  if (!user) {
    return <Shell>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Sign in to view your cart</h1>
        <Button onClick={() => navigate({ to: "/auth" })}>Sign in</Button>
      </div>
    </Shell>;
  }
  if (isLoading) return <Shell><p>Loading cart…</p></Shell>;

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Cart ({items.length})</h1>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Link to="/" className="text-primary font-medium underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="bg-card border rounded-lg p-4 flex gap-4">
                <img src={it.products.image_url} alt={it.products.title} className="size-24 object-contain bg-secondary/30 rounded" />
                <div className="flex-1">
                  <Link to="/product/$id" params={{ id: it.products.id }} className="font-medium hover:text-primary line-clamp-2">
                    {it.products.title}
                  </Link>
                  <div className="text-lg font-bold mt-1">{inr(Number(it.products.price))}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border rounded">
                      <button onClick={() => updateQty.mutate({ id: it.id, quantity: it.quantity - 1 })} className="p-1.5 hover:bg-secondary"><Minus className="size-3" /></button>
                      <span className="px-3 text-sm font-medium">{it.quantity}</span>
                      <button onClick={() => updateQty.mutate({ id: it.id, quantity: it.quantity + 1 })} className="p-1.5 hover:bg-secondary"><Plus className="size-3" /></button>
                    </div>
                    <button onClick={() => remove.mutate(it.id)} className="text-sm text-destructive flex items-center gap-1 hover:underline">
                      <Trash2 className="size-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card border rounded-lg p-4 h-fit space-y-3">
            <h2 className="font-semibold border-b pb-2">Price Details</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span className={shipping === 0 ? "text-success font-medium" : ""}>{shipping === 0 ? "FREE" : inr(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{inr(total)}</span></div>
            <Button className="w-full bg-accent text-accent-foreground hover:opacity-90" size="lg" onClick={() => navigate({ to: "/checkout" })}>
              Place Order
            </Button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container mx-auto px-4 py-6">{children}</main><Footer /></div>;
}
