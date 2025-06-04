
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCog, Briefcase, User as UserIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { currentUser, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (userRole === 'employee') {
        router.push('/employee/dashboard');
      } else if (userRole === 'client') {
        router.push('/');
      }
      // If role is null but user is logged in, they might stay or be redirected
      // depending on app logic (e.g., to a profile completion page).
      // For now, if a known role exists, redirect.
    }
  }, [currentUser, userRole, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  
  // Avoid showing selection if user is logged in and has a role (should have been redirected)
  if (currentUser && userRole) {
     return <div className="flex justify-center items-center min-h-screen">Redirigiendo...</div>;
  }


  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline font-bold">Selecciona tu Rol</CardTitle>
          <CardDescription className="mt-2">Elige cómo quieres acceder a Click Shop.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Button className="w-full" asChild size="lg">
            <Link href="/login/admin" className="flex items-center justify-center">
              <UserCog className="mr-2 h-5 w-5" />
              Soy Administrador
            </Link>
          </Button>
          <Button className="w-full" asChild variant="secondary" size="lg">
            <Link href="/login/employee" className="flex items-center justify-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Soy Empleado
            </Link>
          </Button>
          <Button className="w-full" asChild variant="outline" size="lg">
            <Link href="/login/client" className="flex items-center justify-center">
              <UserIcon className="mr-2 h-5 w-5" />
              Soy Cliente
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
