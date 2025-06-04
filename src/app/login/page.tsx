
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isClient) return;

    setIsLoading(true);
    setError(null);
    localStorage.removeItem('userRole'); // Clear previous role

    // Simulación de llamada a API de autenticación
    await new Promise(resolve => setTimeout(resolve, 1500));

    let loggedInRole: string | null = null;

    if (email === "admin@example.com" && password === "adminpass") {
      console.log("Inicio de sesión como Administrador (simulado)");
      loggedInRole = 'admin';
    } else if (email === "empleado@example.com" && password === "empleadopass") {
      console.log("Inicio de sesión como Empleado (simulado)");
      loggedInRole = 'employee';
    } else if (email === "cliente@example.com" && password === "clientepass") {
      console.log("Inicio de sesión como Cliente (simulado)");
      loggedInRole = 'client';
    } else {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }

    if (loggedInRole) {
      localStorage.setItem('userRole', loggedInRole);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Has ingresado como: ${loggedInRole.charAt(0).toUpperCase() + loggedInRole.slice(1)}`,
      });
      router.push('/');
    }
    
    setIsLoading(false);
  };

  if (!isClient) {
    return null; // O un esqueleto de carga si prefieres
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline font-bold">Iniciar Sesión</CardTitle>
          <CardDescription className="mt-2">Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="#" className="font-semibold text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
           <p className="mt-4 text-center text-xs text-muted-foreground">
            Usuarios de prueba:<br/>
            admin@example.com / adminpass<br/>
            empleado@example.com / empleadopass<br/>
            cliente@example.com / clientepass
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
