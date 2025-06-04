
'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Info, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('userRole'));
    }
  }, [pathname]); // Re-check role on pathname change

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      setUserRole(null);
      toast({
        title: "Cierre de sesión exitoso",
        description: "Has cerrado tu sesión.",
      });
      router.push('/login');
    }
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'employee') return '/employee/dashboard';
    return null;
  }

  const dashboardLink = getDashboardLink();

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
            {isClient && userRole && dashboardLink && (
               <li>
                <Button variant="ghost" asChild>
                  <Link href={dashboardLink} className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                    <LayoutDashboard className="mr-0 h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Panel</span>
                  </Link>
                </Button>
              </li>
            )}
            {isClient && userRole ? (
              <li>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                  <LogOut className="mr-0 h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </li>
            ) : (
              <li>
                <Button variant="ghost" asChild>
                  <Link href="/login" className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                    <User className="mr-0 h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
