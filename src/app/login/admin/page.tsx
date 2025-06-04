
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Loader2, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const MASTER_ADMIN_CODE = "SUPERADMIN2024"; // Código especial para el admin
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "adminpass";

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && localStorage.getItem('userRole') === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleCredentialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isClient) return;

    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular llamada a API

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setStep('code');
    } else {
      setError("Credenciales de administrador incorrectas.");
    }
    setIsLoading(false);
  };

  const handleCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isClient) return;

    setIsLoading(true);
    setError(null);
    localStorage.removeItem('userRole'); 

    await new Promise(resolve => setTimeout(resolve, 500)); // Simular llamada a API

    if (adminCode === MASTER_ADMIN_CODE) {
      localStorage.setItem('userRole', 'admin');
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has ingresado como Administrador.",
        variant: "default",
      });
      router.push('/admin/dashboard');
    } else {
      setError("Código Maestro de Administrador incorrecto.");
    }
    setIsLoading(false);
  };

  if (!isClient) {
    return null; 
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          <UserCog className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline font-bold">Login Administrador</CardTitle>
          {step === 'credentials' && <CardDescription className="mt-2">Ingresa tus credenciales de administrador.</CardDescription>}
          {step === 'code' && <CardDescription className="mt-2">Verificación adicional: Ingresa el Código Maestro.</CardDescription>}
        </CardHeader>
        <CardContent className="pt-6">
          {step === 'credentials' && (
            <form onSubmit={handleCredentialSubmit} className="space-y-6">
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
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Siguiente"
                )}
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <ShieldCheck className="h-6 w-6 mr-2" />
                <p>Credenciales validadas.</p>
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
                  autoFocus
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
               <Button variant="link" onClick={() => { setStep('credentials'); setError(null); setPassword('');}} className="w-full">
                Volver a ingresar credenciales
              </Button>
            </form>
          )}
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

