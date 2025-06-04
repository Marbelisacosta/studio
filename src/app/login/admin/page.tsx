
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const MASTER_ADMIN_CODE = "SUPERADMIN2024"; // Código especial para el admin

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && localStorage.getItem('userRole') === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isClient) return;

    setIsLoading(true);
    setError(null);
    localStorage.removeItem('userRole'); 

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === "admin@example.com" && password === "adminpass" && adminCode === MASTER_ADMIN_CODE) {
      localStorage.setItem('userRole', 'admin');
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has ingresado como Administrador.",
      });
      router.push('/admin/dashboard');
    } else if (adminCode !== MASTER_ADMIN_CODE && email === "admin@example.com" && password === "adminpass") {
      setError("Código Maestro de Administrador incorrecto.");
    }
     else {
      setError("Credenciales de administrador o Código Maestro incorrectos.");
    }
    
    setIsLoading(false);
  };

  if (!isClient) {
    return null; // Evita renderizado en servidor hasta que el cliente esté listo
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          <UserCog className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline font-bold">Login Administrador</CardTitle>
          <CardDescription className="mt-2">Ingresa tus credenciales y el Código Maestro de Administrador.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
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
            <div className="space-y-2">
              <Label htmlFor="adminCode">
                <KeyRound className="inline h-4 w-4 mr-1" />
                Código Maestro de Administrador
              </Label>
              <Input
                id="adminCode"
                type="password" 
                placeholder="Código especial"
                required
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                disabled={isLoading}
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
                "Entrar como Admin"
              )}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Volver a selección de rol
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
