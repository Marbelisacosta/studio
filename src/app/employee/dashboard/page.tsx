
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Edit3, PackageSearch, ClipboardList, Archive } from "lucide-react"; // Archive
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
            <AlertTitle className="font-bold text-accent-foreground">Gestión de Inventario y Pedidos</AlertTitle>
            <AlertDescription className="text-accent-foreground/90">
              Bienvenido, {currentUser.email}. Desde aquí podrás gestionar el inventario (entradas/salidas de stock) y procesar los pedidos de los clientes.
              Las actualizaciones de stock se realizan directamente en Firestore (idealmente, en producción, esto usaría Cloud Functions para validaciones adicionales).
              La gestión de pedidos también interactúa con Firestore.
            </AlertDescription>
          </Alert>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Tareas Comunes</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" asChild className="flex-1">
                <Link href="/" className="flex items-center justify-center">
                  <Archive className="mr-2 h-5 w-5" /> {/* Icono cambiado */}
                  Gestionar Inventario de Productos
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/employee/process-orders" className="flex items-center justify-center">
                   <ClipboardList className="mr-2 h-5 w-5" />
                  Procesar Pedidos
                </Link>
              </Button>
            </div>
          </section>

           <p className="text-muted-foreground text-sm">
            Este panel utiliza Firebase Authentication. Las funcionalidades de actualización de stock y procesamiento de pedidos interactúan con Firestore.
            En un entorno de producción completo, las operaciones críticas se gestionarían a través de Cloud Functions para mayor seguridad y lógica de negocio avanzada.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
