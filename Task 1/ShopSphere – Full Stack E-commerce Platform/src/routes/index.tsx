import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard, type Product } from "@/components/ProductCard";

const CATEGORIES = [
  { slug: "smartphones", label: "Mobiles", emoji: "📱" },
  { slug: "laptops", label: "Laptops", emoji: "💻" },
  { slug: "mens-shirts", label: "Fashion", emoji: "👕" },
  { slug: "beauty", label: "Beauty", emoji: "💄" },
  { slug: "furniture", label: "Home", emoji: "🛋️" },
  { slug: "groceries", label: "Grocery", emoji: "🛒" },
  { slug: "fragrances", label: "Fragrances", emoji: "🌸" },
  { slug: "mens-watches", label: "Watches", emoji: "⌚" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopSphere — Online Shopping for Everything" },
      { name: "description", content: "Shop 100+ products across electronics, fashion, beauty and more with Cash on Delivery." },
      { property: "og:title", content: "ShopSphere" },
      { property: "og:description", content: "100+ products. Cash on delivery. Free shipping." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,title,price,mrp,image_url,rating,brand")
        .order("rating", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Product[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="bg-card border rounded-lg p-4 mb-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max justify-around">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to="/products" search={{ category: c.slug, q: undefined } as any}
                className="flex flex-col items-center gap-2 hover:text-primary transition-colors">
                <div className="text-4xl">{c.emoji}</div>
                <span className="text-sm font-medium">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-primary via-[oklch(0.55_0.22_350)] to-accent text-primary-foreground rounded-lg p-8 mb-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Big Savings Days</h1>
          <p className="text-lg opacity-90">Up to 80% off across 100+ products • Free Delivery • Cash on Delivery</p>
          <Link to="/products" search={{}}
            className="inline-block mt-4 bg-accent text-accent-foreground px-6 py-2 rounded-md font-semibold hover:opacity-90">
            Shop Now
          </Link>
        </div>

        {/* Featured */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Top Rated Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {products?.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
