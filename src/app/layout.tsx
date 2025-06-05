
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
// Remove direct import of Toaster
// import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import Toaster with SSR disabled
const DynamicToaster = dynamic(() =>
  import('@/components/ui/toaster').then((mod) => mod.Toaster),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Gestión de Inventario Click Shop',
  description: 'Tu solución para la gestión eficiente de inventario de productos.',
  manifest: '/manifest.json', // Añadido para PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        {/* Añade el theme-color para la barra de estado en móviles */}
        <meta name="theme-color" content="#e4a939" /> 
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <DynamicToaster /> {/* Use the dynamically imported Toaster */}
        </AuthProvider>
      </body>
    </html>
  );
}
