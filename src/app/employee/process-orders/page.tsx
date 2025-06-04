
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, ArrowLeft, Package, ClipboardList, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import type { Order, OrderStatusType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns'; // Para formatear fechas

const ORDER_STATUSES: OrderStatusType[] = ['Pendiente', 'En preparación', 'Enviado', 'Completado', 'Cancelado'];

export default function ProcessOrdersPage() {
  const { currentUser, userRole, getOrdersFromFirestore, updateOrderStatusInFirestore, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && userRole === 'employee') {
      fetchOrders();
    }
  }, [currentUser, userRole]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setError(null);
    try {
      const fetchedOrders = await getOrdersFromFirestore();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("No se pudo cargar la lista de pedidos. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatusType) => {
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
      toast({
        title: "Estado del Pedido Actualizado",
        description: `El pedido ha sido actualizado a "${newStatus}".`,
      });
      fetchOrders(); // Re-fetch orders to reflect changes
    } catch (err) {
      console.error("Error updating order status:", err);
      toast({
        title: "Error al Actualizar Estado",
        description: (err as Error).message || "No se pudo cambiar el estado del pedido.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    // Si es un objeto Timestamp de Firestore, convertirlo a Date
    if (date.toDate && typeof date.toDate === 'function') {
      return format(date.toDate(), 'dd/MM/yyyy HH:mm');
    }
    // Si ya es un string o Date, intentar formatear
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Fecha inválida';
    }
  };


  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!currentUser || userRole !== 'employee') {
    // Dejar que el panel de empleado principal maneje el redirect.
    return <div className="flex justify-center items-center min-h-screen">Acceso denegado o redirigiendo...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-lg border">
        <CardHeader className="bg-secondary/10">
          <div className="flex items-center space-x-3">
            <ClipboardList className="h-8 w-8 text-secondary-foreground" />
            <CardTitle className="text-3xl font-headline font-bold text-secondary-foreground">
              Procesar Pedidos
            </CardTitle>
          </div>
          <CardDescription>
            Visualiza y actualiza el estado de los pedidos de los clientes.
            En una aplicación de producción, estas actualizaciones se harían mediante Cloud Functions para mayor seguridad y lógica de negocio.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {isLoadingOrders && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Cargando pedidos...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoadingOrders && !error && orders.length === 0 && (
            <Alert variant="default" className="border-primary/50 bg-primary/5">
                <Package className="h-5 w-5 text-primary" />
                <AlertTitle className="font-semibold text-primary">No Hay Pedidos</AlertTitle>
                <AlertDescription className="text-primary/80">
                    Actualmente no hay pedidos para procesar. Asegúrate de haber añadido algunos pedidos de ejemplo en la colección 'Orders' de Firestore.
                </AlertDescription>
            </Alert>
          )}

          {!isLoadingOrders && !error && orders.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderId || order.id}</TableCell>
                       <TableCell>{order.customerEmail}</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell className="text-xs">
                        {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => handleStatusChange(order.id, newStatus as OrderStatusType)}
                        >
                          <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Cambiar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/employee/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel de Empleado
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
