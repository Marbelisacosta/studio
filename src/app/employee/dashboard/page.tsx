
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Edit3, PackageSearch, Truck } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const { currentUser, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!currentUser || userRole !== 'employee') {
        router.push('/login');
      }
    }
  }, [currentUser, userRole, loading, router]);

  if (loading || !currentUser || userRole !== 'employee') {
     return <div className="flex justify-center items-center min-h-screen">Cargando y verificando acceso...</div>;
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
              Bienvenido, {currentUser.email}. Desde aquí podrás actualizar la información de stock de los productos (leyendo de Firestore y actualizando mediante Cloud Functions).
              Navega al catálogo para ver los productos y usar la opción de actualizar.
            </AlertDescription>
          </Alert>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Tareas Comunes</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" asChild className="flex-1">
                <Link href="/" className="flex items-center justify-center">
                  <PackageSearch className="mr-2 h-5 w-5" />
                  Ir al Catálogo de Productos
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/employee/process-orders" className="flex items-center justify-center">
                   <Truck className="mr-2 h-5 w-5" />
                  Procesar Pedidos (Simulado)
                </Link>
              </Button>
            </div>
          </section>

           <p className="text-muted-foreground text-sm">
            Este panel usa Firebase Authentication. Las funcionalidades como "Procesar Pedidos" y la actualización de stock
            requerirían Cloud Functions y Firestore para su implementación completa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
