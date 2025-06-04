
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SiteSettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-xl mx-auto shadow-lg rounded-lg border">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline font-bold text-primary">
              Configuración del Sitio
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <p className="text-muted-foreground">
            Esta sección permitiría configurar diversos aspectos del sitio web, como información de contacto,
            integraciones, opciones de envío, y más.
          </p>
          <div className="bg-secondary/50 p-4 rounded-md text-center">
            <p className="font-semibold text-secondary-foreground">Funcionalidad Simulada</p>
            <p className="text-sm text-secondary-foreground/80">Las opciones de configuración no son funcionales en esta demo.</p>
          </div>
          <Button asChild variant="outline" className="mt-6">
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
