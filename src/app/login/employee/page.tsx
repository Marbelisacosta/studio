
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Loader2, KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { useAuth, registerUserWithRoleInFirestore } from '@/context/AuthContext';

const EMPLOYEE_ACCESS_CODE = "EMPLEADOVIP2024"; 

export default function EmployeeLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const [formMode, setFormMode] = useState<'login' | 'register'>('login');
  
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, userRole, loading: authLoading } = useAuth();
  const [tempUser, setTempUser] = useState<User | null>(null);


  useEffect(() => {
    if (!authLoading && currentUser && userRole === 'employee') {
      router.push('/employee/dashboard');
    }
  }, [currentUser, userRole, authLoading, router]);

  const handleCredentialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (formMode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setTempUser(userCredential.user);
        setStep('code');
      } else { // formMode === 'register'
        setStep('code'); // Proceed to code verification after "registering" credentials
      }
    } catch (err: any) {
      setError(err.message || "Error en credenciales.");
       if (err.code === 'auth/user-not-found' && formMode === 'login') {
        setError("Empleado no encontrado. ¿Deseas registrarte?");
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

    if (accessCode !== EMPLOYEE_ACCESS_CODE) {
      setError("Código de Acceso Empleado incorrecto.");
      setIsLoading(false);
      return;
    }

    try {
      let targetUser = tempUser;

      if (formMode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        targetUser = userCredential.user;
        await registerUserWithRoleInFirestore(targetUser.uid, targetUser.email, 'employee');
        await signInWithEmailAndPassword(auth, email, password); 
      } else if (targetUser) { // Login mode
         await registerUserWithRoleInFirestore(targetUser.uid, targetUser.email, 'employee');
      } else {
        setError("Error inesperado. Por favor, intenta de nuevo desde el paso de credenciales.");
        setIsLoading(false);
        setStep('credentials');
        return;
      }
      
      toast({
        title: formMode === 'register' ? "Registro y activación exitosos" : "Acceso de empleado concedido",
        description: "Has ingresado como Empleado.",
        variant: "default",
      });
      router.push('/employee/dashboard');
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
    setAccessCode('');
    setError(null);
    setTempUser(null);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Verificando sesión...</div>;
  }
  if (!authLoading && currentUser && userRole === 'employee') {
     return <div className="flex justify-center items-center min-h-screen">Redirigiendo al panel...</div>;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center">
          {formMode === 'login' ? (
            <Briefcase className="mx-auto h-10 w-10 text-primary mb-3" />
          ) : (
            <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
          )}
          <CardTitle className="text-3xl font-headline font-bold">
            {formMode === 'login' ? 'Login Empleado' : 'Registro Empleado'}
          </CardTitle>
          {step === 'credentials' && (
            <CardDescription className="mt-2">
              {formMode === 'login' 
                ? 'Ingresa tus credenciales de empleado.' 
                : 'Completa tus datos para registrarte. Necesitarás un Código de Acceso.'}
            </CardDescription>
          )}
          {step === 'code' && (
            <CardDescription className="mt-2">
              Verificación adicional: Ingresa tu Código de Acceso.
              {formMode === 'register' && " Este código es necesario para activar tu nueva cuenta de empleado."}
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
                    placeholder="empleado@example.com"
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
                    <Button variant="link" className="p-0 h-auto text-primary" onClick={() => { setFormMode('register'); resetFormAndError(); setStep('credentials');}}>
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
                <p>{formMode === 'login' ? 'Credenciales validadas.' : 'Verifica tu intención de ser empleado.'}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessCode">
                  <KeyRound className="inline h-4 w-4 mr-1" />
                  Código de Acceso Empleado
                </Label>
                <Input
                  id="accessCode"
                  type="password" 
                  placeholder="Código de acceso"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
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
                    {formMode === 'login' ? 'Verificando Código...' : 'Activando Cuenta Empleado...'}
                  </>
                ) : (
                  formMode === 'login' ? "Entrar como Empleado" : "Activar y Entrar como Empleado"
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
