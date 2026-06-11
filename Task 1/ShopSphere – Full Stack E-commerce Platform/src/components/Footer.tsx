export function Footer() {
  return (
    <footer className="bg-secondary mt-12 border-t">
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h3 className="font-semibold mb-3">ShopSphere</h3>
          <p className="text-muted-foreground">Your one-stop shop for everything.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Help</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>Payments</li><li>Shipping</li><li>Returns</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Policy</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>Privacy</li><li>Terms</li><li>Security</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-muted-foreground">support@shopsphere.demo</p>
        </div>
      </div>
      <div className="text-center py-4 text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} ShopSphere — Demo project
      </div>
    </footer>
  );
}
