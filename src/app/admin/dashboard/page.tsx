
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, LayoutDashboard, Users, UserCheck } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    if (role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  if (!isClient || userRole !== 'admin') {
    // Muestra un loader o nada mientras se verifica el rol y redirige
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
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
              Tienes acceso completo (simulado) a todas las funciones de administración.
            </AlertDescription>
          </Alert>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90 flex items-center">
              <Users className="mr-3 h-6 w-6 text-primary" />
              Gestión de Usuarios y Roles (Simulado)
            </h2>
            <p className="text-muted-foreground mb-4">
              En un sistema real, aquí es donde podrías aprobar nuevas cuentas de empleados,
              asignar o cambiar roles, y gestionar los usuarios existentes.
              Cualquier nuevo registro de empleado o solicitud de cambio de rol requeriría tu aprobación.
            </p>
            <Button variant="outline" disabled className="w-full sm:w-auto">
              <UserCheck className="mr-2 h-5 w-5" />
              Ver Usuarios Pendientes (Simulado)
            </Button>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Otras Acciones (Simuladas)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" disabled>Ver Reportes de Ventas</Button>
              <Button variant="outline" disabled>Configuración del Sitio</Button>
              <Button variant="outline" disabled>Moderar Contenido</Button>
            </div>
          </section>

           <p className="text-muted-foreground text-sm mt-6">
            Este es un panel de control simulado. Las funcionalidades reales como la gestión de usuarios,
            aprobaciones y notificaciones requerirían desarrollo de backend y una base de datos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
