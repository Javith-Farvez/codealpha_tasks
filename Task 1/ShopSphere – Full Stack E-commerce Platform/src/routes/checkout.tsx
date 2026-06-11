import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/checkout")({ component: Checkout });

const schema = z.object({
  shipping_name: z.string().trim().min(2).max(80),
  shipping_phone: z.string().trim().regex(/^\d{10}$/, "Enter 10-digit phone"),
  shipping_address: z.string().trim().min(5).max(200),
  shipping_city: z.string().trim().min(2).max(60),
  shipping_pincode: z.string().trim().regex(/^\d{6}$/, "Enter 6-digit pincode"),
});

function Checkout() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [method, setMethod] = useState<"cod" | "card" | "upi">("cod");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    shipping_name: "", shipping_phone: "", shipping_address: "", shipping_city: "", shipping_pincode: "",
  });

  if (loading) return <Shell><p>Loading…</p></Shell>;
  if (!user) { navigate({ to: "/auth" }); return null; }
  if (!items.length) return <Shell><p>Your cart is empty.</p></Shell>;

  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const tracking = [
        { step: "Order Placed", at: new Date().toISOString(), done: true },
        { step: "Confirmed", at: null, done: false },
        { step: "Shipped", at: null, done: false },
        { step: "Out for Delivery", at: null, done: false },
        { step: "Delivered", at: null, done: false },
      ];
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user.id,
        payment_method: method,
        payment_status: method === "cod" ? "pending" : "paid",
        total,
        ...parsed.data,
        tracking_steps: tracking,
      }).select("id").single();
      if (error) throw error;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.products.id,
        title: i.products.title,
        image_url: i.products.image_url,
        price: i.products.price,
        quantity: i.quantity,
      }));
      const { error: e2 } = await supabase.from("order_items").insert(orderItems);
      if (e2) throw e2;

      await clear.mutateAsync();
      toast.success("Order placed successfully!");
      navigate({ to: "/orders/$id", params: { id: order.id } });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <section className="bg-card border rounded-lg p-4 space-y-3">
            <h2 className="font-semibold">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full name" v={form.shipping_name} on={(v) => setForm({ ...form, shipping_name: v })} />
              <Field label="Phone (10 digits)" v={form.shipping_phone} on={(v) => setForm({ ...form, shipping_phone: v })} />
              <div className="sm:col-span-2"><Field label="Address" v={form.shipping_address} on={(v) => setForm({ ...form, shipping_address: v })} /></div>
              <Field label="City" v={form.shipping_city} on={(v) => setForm({ ...form, shipping_city: v })} />
              <Field label="Pincode (6 digits)" v={form.shipping_pincode} on={(v) => setForm({ ...form, shipping_pincode: v })} />
            </div>
          </section>

          {/* Payment */}
          <section className="bg-card border rounded-lg p-4 space-y-3">
            <h2 className="font-semibold">Payment Method</h2>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)}>
              <PayOption value="cod" label="Cash on Delivery" desc="Pay with cash when your order arrives" current={method} />
              <PayOption value="upi" label="UPI (Demo)" desc="Pay instantly using any UPI app" current={method} />
              <PayOption value="card" label="Credit / Debit Card (Demo)" desc="Visa, Mastercard, RuPay" current={method} />
            </RadioGroup>
            {method !== "cod" && (
              <p className="text-xs text-muted-foreground">Demo mode — no real payment is processed.</p>
            )}
          </section>
        </div>

        {/* Summary */}
        <div className="bg-card border rounded-lg p-4 h-fit space-y-3">
          <h2 className="font-semibold border-b pb-2">Order Summary</h2>
          <div className="space-y-2 max-h-60 overflow-auto">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 mr-2">{i.products.title} × {i.quantity}</span>
                <span>{inr(Number(i.products.price) * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{shipping === 0 ? "FREE" : inr(shipping)}</span></div>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{inr(total)}</span></div>
          <Button className="w-full bg-accent text-accent-foreground hover:opacity-90" size="lg" disabled={busy} onClick={placeOrder}>
            {busy ? "Placing order…" : method === "cod" ? "Place Order (COD)" : "Pay & Place Order"}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input value={v} onChange={(e) => on(e.target.value)} className="mt-1" />
    </div>
  );
}

function PayOption({ value, label, desc, current }: { value: string; label: string; desc: string; current: string }) {
  return (
    <label className={`flex gap-3 p-3 border rounded cursor-pointer ${current === value ? "border-primary bg-primary/5" : ""}`}>
      <RadioGroupItem value={value} />
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </label>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 container mx-auto px-4 py-6">{children}</main><Footer /></div>;
}
