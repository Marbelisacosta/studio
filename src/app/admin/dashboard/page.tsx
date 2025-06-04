
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, LayoutDashboard, Users, UserCheck, BarChart3, Settings, ShieldX } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!currentUser || userRole !== 'admin') {
        router.push('/login');
      }
    }
  }, [currentUser, userRole, loading, router]);

  if (loading || !currentUser || userRole !== 'admin') {
    return <div className="flex justify-center items-center min-h-screen">Cargando y verificando acceso...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-3xl mx-auto shadow-xl overflow-hidden rounded-lg border">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline font-bold text-primary">
              Panel de Administrador
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <Alert variant="default" className="border-primary text-primary-foreground bg-primary/90">
            <ShieldAlert className="h-5 w-5 text-primary-foreground" />
            <AlertTitle className="font-bold text-primary-foreground">Modo Administrador Activado</AlertTitle>
            <AlertDescription className="text-primary-foreground/90">
              Tienes acceso a todas las funciones de administración. (Bienvenido, {currentUser.email})
              En una aplicación real, aquí gestionarías usuarios, roles y configuraciones globales desde Firestore.
            </AlertDescription>
          </Alert>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90 flex items-center">
              <Users className="mr-3 h-6 w-6 text-primary" />
              Gestión de Usuarios y Roles
            </h2>
            <p className="text-muted-foreground mb-4">
              Aquí es donde podrías aprobar nuevas cuentas de empleados (modificando su rol en Firestore),
              asignar o cambiar roles, y gestionar los usuarios existentes.
              La asignación de roles segura se haría a través de Cloud Functions.
            </p>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/admin/pending-users">
                <UserCheck className="mr-2 h-5 w-5" />
                Ver Usuarios Pendientes (Simulado)
              </Link>
            </Button>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Otras Acciones Administrativas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/sales-reports">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Ver Reportes de Ventas (Simulado)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/site-settings">
                  <Settings className="mr-2 h-5 w-5" />
                  Configuración del Sitio (Simulado)
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/moderate-content">
                  <ShieldX className="mr-2 h-5 w-5" />
                  Moderar Contenido (Simulado)
                </Link>
              </Button>
            </div>
          </section>

           <p className="text-muted-foreground text-sm mt-6">
            Este panel utiliza Firebase Authentication para el acceso. Las funcionalidades listadas aquí
            requerirían desarrollo de backend con Cloud Functions y Firestore para ser completamente operativas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
