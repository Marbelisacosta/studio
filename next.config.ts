
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Add this line for static export
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Add this if using next export with next/image
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: 'public',
  register: true, // Registra el service worker
  skipWaiting: true, // Instala nuevas versiones del service worker inmediatamente
  disable: process.env.NODE_ENV === 'development', // Deshabilita PWA en desarrollo para evitar problemas de caché
  // swSrc: 'service-worker.js', // Opcional: si tienes un service worker personalizado
});


export default withPWA(nextConfig);
