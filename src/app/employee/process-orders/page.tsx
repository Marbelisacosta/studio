
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProcessOrdersPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-xl mx-auto shadow-lg rounded-lg border">
        <CardHeader className="bg-secondary/10">
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-secondary-foreground" />
            <CardTitle className="text-3xl font-headline font-bold text-secondary-foreground">
              Procesar Pedidos
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <p className="text-muted-foreground">
            En esta sección, los empleados podrían ver los pedidos pendientes, actualizar sus estados (ej. en preparación, enviado),
            y gestionar la logística de envío.
          </p>
          <div className="bg-accent/10 p-4 rounded-md text-center">
            <p className="font-semibold text-accent-foreground">Funcionalidad Simulada</p>
            <p className="text-sm text-accent-foreground/80">No hay pedidos reales para procesar en esta demostración.</p>
          </div>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/employee/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel de Empleado
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
