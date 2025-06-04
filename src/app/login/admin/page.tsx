
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Loader2, KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { useAuth, registerUserWithRoleInFirestore } from '@/context/AuthContext';

const MASTER_ADMIN_CODE = "SUPERADMIN2024"; 

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const [formMode, setFormMode] = useState<'login' | 'register'>('login');
  
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, userRole, loading: authLoading } = useAuth();
  const [tempUser, setTempUser] = useState<User | null>(null); // To hold user after credential step in register mode

  useEffect(() => {
    if (!authLoading && currentUser && userRole === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [currentUser, userRole, authLoading, router]);

  const handleCredentialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (formMode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setTempUser(userCredential.user); // Store user for code step
        // Role check will happen via AuthContext and redirect if already admin.
        setStep('code');
      } else { // formMode === 'register'
        // For registration, we don't sign in yet. Just proceed to code verification.
        // User creation will happen after code verification.
        setStep('code'); 
      }
    } catch (err: any) {
      setError(err.message || "Error en credenciales.");
      if (err.code === 'auth/user-not-found' && formMode === 'login') {
        setError("Administrador no encontrado. ¿Deseas registrarte?");
      } else if (err.code === 'auth/wrong-password' && formMode === 'login') {
        setError("Contraseña incorrecta.");
      } else if (err.code === 'auth/email-already-in-use' && formMode === 'register'){
        setError("Este correo ya está registrado. ¿Deseas iniciar sesión?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (adminCode !== MASTER_ADMIN_CODE) {
      setError("Código Maestro de Administrador incorrecto.");
      setIsLoading(false);
      return;
    }

    try {
      let targetUser = tempUser; // User from login step or null if register mode

      if (formMode === 'register') {
        // Create user in Firebase Auth NOW, then register role in Firestore
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        targetUser = userCredential.user;
        await registerUserWithRoleInFirestore(targetUser.uid, targetUser.email, 'admin');
        // Sign in the new user after successful registration and code verification
        await signInWithEmailAndPassword(auth, email, password); 
      } else if (targetUser) { // Login mode, and user from login step exists
        await registerUserWithRoleInFirestore(targetUser.uid, targetUser.email, 'admin');
      } else {
        // Fallback if tempUser is somehow null in login mode (should not happen)
        setError("Error inesperado. Por favor, intenta de nuevo desde el paso de credenciales.");
        setIsLoading(false);
        setStep('credentials');
        return;
      }
      
      toast({
        title: formMode === 'register' ? "Registro y activación exitosos" : "Acceso de administrador concedido",
        description: "Has ingresado como Administrador.",
        variant: "default",
      });
      router.push('/admin/dashboard'); // AuthProvider will pick up the role and redirect.
    } catch (err: any) {
      setError(err.message || "Error al verificar código o finalizar registro.");
       if (err.code === 'auth/email-already-in-use' && formMode === 'register'){
        setError("Este correo ya está en uso. Intenta iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetFormAndError = () => {
    // Keep email/password if switching from register to login for convenience
    // setPassword(''); 
    setAdminCode('');
    setError(null);
    setTempUser(null);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Verificando sesión...</div>;
  }
  if (!authLoading && currentUser && userRole === 'admin') {
     return <div className="flex justify-center items-center min-h-screen">Redirigiendo al panel...</div>;
  }


  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          {formMode === 'login' ? (
            <UserCog className="mx-auto h-10 w-10 text-primary mb-3" />
          ) : (
            <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
          )}
          <CardTitle className="text-3xl font-headline font-bold">
            {formMode === 'login' ? 'Login Administrador' : 'Registro Administrador'}
          </CardTitle>
          {step === 'credentials' && (
            <CardDescription className="mt-2">
              {formMode === 'login' 
                ? 'Ingresa tus credenciales de administrador.' 
                : 'Completa tus datos para registrarte. Necesitarás un Código Maestro.'}
            </CardDescription>
          )}
          {step === 'code' && (
            <CardDescription className="mt-2">
              Verificación adicional: Ingresa el Código Maestro.
              {formMode === 'register' && " Este código es necesario para activar tu nueva cuenta de administrador."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {step === 'credentials' && (
            <>
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
                      {formMode === 'login' ? 'Verificando...' : 'Siguiente...'}
                    </>
                  ) : (
                    formMode === 'login' ? "Siguiente" : "Registrarse y Continuar"
                  )}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {formMode === 'login' ? (
                  <>
                    ¿No tienes cuenta?{' '}
                    <Button variant="link" className="p-0 h-auto text-primary" onClick={() => { setFormMode('register'); resetFormAndError(); setStep('credentials'); }}>
                      Regístrate aquí
                    </Button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{' '}
                    <Button variant="link" className="p-0 h-auto text-primary" onClick={() => { setFormMode('login'); resetFormAndError(); setStep('credentials'); }}>
                      Inicia Sesión
                    </Button>
                  </>
                )}
              </p>
            </>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <ShieldCheck className="h-6 w-6 mr-2" />
                <p>{formMode === 'login' ? 'Credenciales validadas.' : 'Verifica tu intención de ser administrador.'}</p>
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
                    {formMode === 'login' ? 'Verificando Código...' : 'Activando Cuenta Admin...'}
                  </>
                ) : (
                  formMode === 'login' ? "Entrar como Admin" : "Activar y Entrar como Admin"
                )}
              </Button>
               <Button variant="link" onClick={() => { setStep('credentials'); resetFormAndError();}} className="w-full text-muted-foreground">
                Volver a credenciales
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
