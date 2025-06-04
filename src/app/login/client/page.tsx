
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, registerUserWithRoleInFirestore } from '@/context/AuthContext';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'login' | 'register'>('login');

  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, userRole, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && currentUser && userRole === 'client') {
      router.push('/');
    }
  }, [currentUser, userRole, authLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let userCredential;
      if (formMode === 'login') {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // For clients, role is directly registered/updated upon login if not present
        // This assumes a client role by default if they log in via this page.
        await registerUserWithRoleInFirestore(userCredential.user.uid, userCredential.user.email, 'client');
      } else { // formMode === 'register'
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await registerUserWithRoleInFirestore(userCredential.user.uid, userCredential.user.email, 'client');
        // Sign in the new user
        await signInWithEmailAndPassword(auth, email, password);
      }
      toast({
        title: formMode === 'login' ? "Inicio de sesión exitoso" : "Registro exitoso",
        description: "Has ingresado como Cliente.",
      });
      router.push('/'); 
    } catch (err: any) {
       setError(err.message || "Error en credenciales o registro.");
        if (err.code === 'auth/user-not-found' && formMode === 'login') {
            setError("Cliente no encontrado. ¿Deseas registrarte?");
        } else if (err.code === 'auth/wrong-password' && formMode === 'login') {
            setError("Contraseña incorrecta.");
        } else if (err.code === 'auth/email-already-in-use' && formMode === 'register'){
            setError("Este correo ya está registrado. ¿Deseas iniciar sesión?");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormAndError = () => {
    // Keep email/password
    setError(null);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Verificando sesión...</div>;
  }
   if (!authLoading && currentUser && userRole === 'client') {
     return <div className="flex justify-center items-center min-h-screen">Redirigiendo...</div>;
  }


  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          <UserIcon className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline font-bold">
            {formMode === 'login' ? 'Login Cliente' : 'Registro Cliente'}
          </CardTitle>
          <CardDescription className="mt-2">
            {formMode === 'login' ? 'Ingresa tus credenciales.' : 'Crea tu cuenta para empezar a comprar.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@example.com"
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
                autoComplete={formMode === 'login' ? "current-password" : "new-password"}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {formMode === 'login' ? 'Ingresando...' : 'Registrando...'}
                </>
              ) : (
                formMode === 'login' ? 'Entrar como Cliente' : 'Registrarse'
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {formMode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => { setFormMode('register'); resetFormAndError(); }}>
                  Regístrate aquí
                </Button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => { setFormMode('login'); resetFormAndError();}}>
                  Inicia Sesión
                </Button>
              </>
            )}
          </p>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Volver a selección de rol
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
