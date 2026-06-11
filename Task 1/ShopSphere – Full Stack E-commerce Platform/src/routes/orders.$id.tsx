import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, MapPin, CreditCard } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/orders/$id")({ component: OrderDetail });

function OrderDetail() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as any;
    },
  });

  if (loading || isLoading) return <Shell><p>Loading…</p></Shell>;
  if (!user) { navigate({ to: "/auth" }); return null; }
  if (!order) return <Shell><p>Order not found.</p></Shell>;

  const steps = (order.tracking_steps ?? []) as { step: string; at: string | null; done: boolean }[];

  return (
    <Shell>
      <div className="bg-success/10 border border-success rounded-lg p-6 text-center mb-6">
        <CheckCircle2 className="size-12 text-success mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="text-sm text-muted-foreground mt-1">Order #{order.id.slice(0, 8)} • Total {inr(Number(order.total))}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 bg-card border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Order Tracking</h2>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                {s.done ? <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" /> : <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-medium ${s.done ? "" : "text-muted-foreground"}`}>{s.step}</p>
                  {s.at && <p className="text-xs text-muted-foreground">{new Date(s.at).toLocaleString()}</p>}
                </div>
              </li>
            ))}
          </ol>

          <h2 className="font-semibold mt-6 mb-3">Items</h2>
          <div className="space-y-3">
            {order.order_items?.map((it: any) => (
              <div key={it.id} className="flex gap-3 border-t pt-3">
                <img src={it.image_url} alt={it.title} className="size-16 object-contain bg-secondary/30 rounded" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">{it.title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                </div>
                <div className="font-semibold">{inr(Number(it.price) * it.quantity)}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="size-4" /> Delivery Address</h3>
            <p className="text-sm">{order.shipping_name}</p>
            <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
            <p className="text-sm text-muted-foreground">{order.shipping_city} - {order.shipping_pincode}</p>
            <p className="text-sm text-muted-foreground">📞 {order.shipping_phone}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><CreditCard className="size-4" /> Payment</h3>
            <p className="text-sm capitalize">{order.payment_method} — {order.payment_status}</p>
            <p className="text-lg font-bold mt-1">{inr(Number(order.total))}</p>
          </div>
          <Link to="/orders"><Button variant="outline" className="w-full">All Orders</Button></Link>
          <Link to="/"><Button className="w-full">Continue Shopping</Button></Link>
        </aside>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container mx-auto px-4 py-6">{children}</main><Footer /></div>;
}
