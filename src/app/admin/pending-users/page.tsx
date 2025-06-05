
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, ArrowLeft, ShieldAlert, Loader2, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import type { UserProfile, UserRoleType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ManageUsersPage() {
  const { currentUser, userRole, getAllUsersFromFirestore, updateUserRoleInFirestore, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && userRole === 'admin') {
      fetchUsers();
    }
  }, [currentUser, userRole]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError(null);
    try {
      const fetchedUsers = await getAllUsersFromFirestore();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("No se pudo cargar la lista de usuarios. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRoleType) => {
    if (userId === currentUser?.uid && newRole !== 'admin') {
      toast({
        title: "Acción no permitida",
        description: "No puedes cambiar tu propio rol a uno que no sea administrador.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserRoleInFirestore(userId, newRole);
      toast({
        title: "Rol Actualizado",
        description: `El rol del usuario ha sido cambiado a ${newRole}.`,
      });
      fetchUsers(); // Re-fetch users to reflect changes
    } catch (err) {
      console.error("Error updating role:", err);
      toast({
        title: "Error al actualizar rol",
        description: (err as Error).message || "No se pudo cambiar el rol del usuario.",
        variant: "destructive",
      });
    }
  };
  
  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!currentUser || userRole !== 'admin') {
    // router.push('/login'); // Esto puede causar un bucle si el contexto aún no está listo.
    // Dejar que el panel de admin principal maneje el redirect.
    return <div className="flex justify-center items-center min-h-screen">Acceso denegado o redirigiendo...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-3xl mx-auto shadow-lg rounded-lg border">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center space-x-3">
            <UserCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline font-bold text-primary">
              Gestionar Usuarios y Roles
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <Alert variant="default" className="border-blue-500 bg-blue-50 text-blue-700">
            <ShieldAlert className="h-5 w-5 text-blue-600" />
            <AlertTitle className="font-bold text-blue-700">Gestión de Roles</AlertTitle>
            <AlertDescription className="text-blue-600">
              Desde aquí puedes ver todos los usuarios registrados y modificar sus roles.
              Recuerda que asignar roles de 'admin' o 'employee' otorga permisos elevados.
            </AlertDescription>
          </Alert>

          {isLoadingUsers && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Cargando usuarios...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoadingUsers && !error && users.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No hay usuarios registrados para mostrar.</p>
          )}

          {!isLoadingUsers && !error && users.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol Actual</TableHead>
                    <TableHead className="text-right">Cambiar Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.email || 'No disponible'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'employee' ? 'bg-yellow-100 text-yellow-700' :
                          user.role === 'client' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role || 'Sin rol'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={user.role}
                          onValueChange={(newRoleSelected) => handleRoleChange(user.uid, newRoleSelected as UserRoleType)}
                          disabled={user.uid === currentUser?.uid && user.role === 'admin'}
                        >
                          <SelectTrigger className="w-[150px] h-9">
                            <SelectValue placeholder="Cambiar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Cliente</SelectItem>
                            <SelectItem value="employee">Empleado</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <Button asChild variant="outline" className="mt-6 w-full sm:w-auto">
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel de Administrador
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
