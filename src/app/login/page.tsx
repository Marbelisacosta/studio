
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCog, Briefcase, User as UserIcon, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleSelectionPage() {
  const router = useRouter();

  useEffect(() => {
    // Si ya hay un rol, redirigir al dashboard apropiado o a la home
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (userRole === 'employee') {
        router.push('/employee/dashboard');
      } else if (userRole === 'client') {
        router.push('/');
      }
    }
  }, [router]);

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
