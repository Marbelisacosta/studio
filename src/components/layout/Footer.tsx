export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Click Shop. All rights reserved.</p>
        <p>Your minimalist e-commerce solution.</p>
      </div>
    </footer>
  );
}
