
'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Archive, Info, User, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { currentUser, userRole, logout, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Cierre de sesión exitoso",
        description: "Has cerrado tu sesión.",
      });
    } catch (error) {
       toast({
        title: "Error al cerrar sesión",
        description: (error as Error).message || "Ocurrió un problema.",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'employee') return '/employee/dashboard';
    return null; 
  }

  const dashboardLink = getDashboardLink();

  const mainNavLinkText = (currentUser && (userRole === 'admin' || userRole === 'employee')) ? "Inventario" : "Catálogo";
  const MainNavLinkIcon = (currentUser && (userRole === 'admin' || userRole === 'employee')) ? Archive : BookOpen;


  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav>
          <ul className="flex items-center space-x-1 sm:space-x-2">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                  <MainNavLinkIcon className="mr-0 h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">{mainNavLinkText}</span>
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
            {currentUser && dashboardLink && (
               <li>
                <Button variant="ghost" asChild>
                  <Link href={dashboardLink} className="flex items-center px-2 py-1 sm:px-3 sm:py-2">
                    <LayoutDashboard className="mr-0 h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Panel</span>
                  </Link>
                </Button>
              </li>
            )}
            {currentUser ? (
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
