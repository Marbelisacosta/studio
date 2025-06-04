import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Info, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav>
          <ul className="flex items-center space-x-1 sm:space-x-2">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                  <ShoppingBag className="mr-0 h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Productos</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/about" className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                  <Info className="mr-0 h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Nosotros</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                  <User className="mr-0 h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
