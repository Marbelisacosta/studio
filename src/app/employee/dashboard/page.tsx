
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Edit3, PackageSearch } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    if (role !== 'employee') {
      router.push('/login');
    }
  }, [router]);

  if (!isClient || userRole !== 'employee') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden rounded-lg border">
        <CardHeader className="bg-secondary/10">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-8 w-8 text-secondary-foreground" />
            <CardTitle className="text-3xl font-headline font-bold text-secondary-foreground">
              Panel de Empleado
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <Alert variant="default" className="border-accent text-accent-foreground bg-accent/90">
            <Edit3 className="h-5 w-5 text-accent-foreground" />
            <AlertTitle className="font-bold text-accent-foreground">Gestión de Inventario</AlertTitle>
            <AlertDescription className="text-accent-foreground/90">
              Desde aquí podrás actualizar la información de stock de los productos. 
              Navega al catálogo para ver los productos y usar la opción de actualizar.
            </AlertDescription>
          </Alert>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Tareas Comunes (Simuladas)</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" asChild className="flex-1">
                <Link href="/" className="flex items-center justify-center">
                  <PackageSearch className="mr-2 h-5 w-5" />
                  Ir al Catálogo de Productos
                </Link>
              </Button>
              <Button variant="outline" disabled className="flex-1">Procesar Pedidos</Button>
            </div>
          </section>

           <p className="text-muted-foreground text-sm">
            Este es un panel de control simulado para empleados. Las funcionalidades como "Procesar Pedidos" requerirían desarrollo de backend. 
            La actualización de stock se simula en las tarjetas de producto del catálogo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
