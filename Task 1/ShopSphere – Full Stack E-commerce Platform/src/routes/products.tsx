import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard, type Product } from "@/components/ProductCard";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "All Products — ShopSphere" }, { name: "description", content: "Browse all products on ShopSphere." }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q, category } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: ["products", "list", q, category],
    queryFn: async () => {
      let query = supabase.from("products").select("id,title,price,mrp,image_url,rating,brand");
      if (category) query = query.eq("category", category);
      if (q) query = query.ilike("title", `%${q}%`);
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as Product[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">
          {category ? `Category: ${category}` : q ? `Results for "${q}"` : "All Products"}
        </h1>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="text-muted-foreground">No products found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
