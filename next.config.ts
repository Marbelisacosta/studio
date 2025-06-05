
import type {NextConfig} from 'next';
// import withPWAInit from 'next-pwa'; // Temporarily commented out for diagnostics

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Add this line for static export
  typescript: {
    // ignoreBuildErrors: true, // This was previously removed, which is good
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

// const withPWA = withPWAInit({ // Temporarily commented out
//   dest: 'public',
//   register: true, // Registra el service worker
//   skipWaiting: true, // Instala nuevas versiones del service worker inmediatamente
//   disable: process.env.NODE_ENV === 'development', // Deshabilita PWA en desarrollo para evitar problemas de caché
//   // swSrc: 'service-worker.js', // Opcional: si tienes un service worker personalizado
// });


// export default withPWA(nextConfig); // Temporarily export nextConfig directly
export default nextConfig; // Exporting nextConfig directly for now

