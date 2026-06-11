import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — ShopSphere" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, payment_method, created_at, order_items(title, image_url, quantity)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loading) return <Shell><p>Loading…</p></Shell>;
  if (!user) { navigate({ to: "/auth" }); return null; }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {isLoading ? <p>Loading…</p> : !data?.length ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Link to="/"><Button>Start shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((o: any) => (
            <Link to="/orders/$id" params={{ id: o.id }} key={o.id} className="block bg-card border rounded-lg p-4 hover:shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-sm">{new Date(o.created_at).toLocaleDateString()} • {o.payment_method.toUpperCase()}</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium capitalize">{o.status.replace("_", " ")}</span>
              </div>
              <div className="flex gap-2 overflow-auto">
                {o.order_items?.slice(0, 4).map((it: any, i: number) => (
                  <img key={i} src={it.image_url} alt={it.title} className="size-14 object-contain bg-secondary/30 rounded" />
                ))}
              </div>
              <div className="mt-2 text-right font-bold">{inr(Number(o.total))}</div>
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container mx-auto px-4 py-6">{children}</main><Footer /></div>;
}
