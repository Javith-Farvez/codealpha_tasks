import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, User, Search, Package, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q, category: undefined } as any });
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-[oklch(0.55_0.22_350)] text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0">
          Shop<span className="text-accent">Sphere</span>
          
        </Link>
        <form onSubmit={onSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </form>
        <nav className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: "/orders" })}>
                  <Package className="size-4 mr-2" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="size-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" onClick={() => navigate({ to: "/auth" })}>
              <User className="size-4 mr-2" /> Sign in
            </Button>
          )}
          <Link to="/cart" className="relative">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground gap-2">
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full size-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
