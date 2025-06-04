
'use client';

import { useState, useEffect } from 'react';
import { ProductSearch } from '@/components/products/ProductSearch';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product as ProductType } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchIcon as SearchIconLucide, Terminal, ShoppingBag } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';


export default function HomePage() {
  const [productsToDisplay, setProductsToDisplay] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  // userRole ya no se usa directamente aquí para mostrar la alerta de admin, se movió a /admin/dashboard

  const handleResults = (products: ProductType[]) => {
    setProductsToDisplay(products);
    setHasSearched(true);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setHasSearched(true); 
    }
  };

  const handleError = (error: string | null) => {
    setSearchError(error);
    setHasSearched(true);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* La alerta de admin se ha movido a /admin/dashboard */}

      <section className="mb-10 flex flex-col items-center">
        <ShoppingBag className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold mb-6 text-center text-foreground">
          Encuentra Tu Producto Perfecto
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Usa nuestra búsqueda inteligente para descubrir productos adaptados a tus necesidades. ¡Simplemente escribe lo que estás buscando!
        </p>
        <ProductSearch
          onResults={handleResults}
          onLoading={handleLoading}
          onError={handleError}
          isLoading={isLoading}
        />
      </section>

      {searchError && (
         <Alert variant="destructive" className="mb-8 max-w-xl mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error de Búsqueda</AlertTitle>
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && productsToDisplay.length > 0 && (
        <section>
          <h2 className="text-3xl font-headline font-semibold mb-8 text-center text-foreground">
            Resultados de Búsqueda
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsToDisplay.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {!isLoading && productsToDisplay.length === 0 && hasSearched && !searchError && (
         <div className="text-center text-muted-foreground py-10">
            <SearchIconLucide className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl font-semibold">No Se Encontraron Productos</p>
            <p>No pudimos encontrar ningún producto que coincida con tu búsqueda. Intenta con diferentes palabras clave.</p>
          </div>
      )}

      {!isLoading && !hasSearched && (
         <div className="text-center text-muted-foreground py-16">
            <SearchIconLucide className="mx-auto h-16 w-16 mb-6 opacity-50" />
            <p className="text-2xl font-headline">Tu aventura de productos comienza aquí.</p>
            <p className="text-md">Ingresa un término de búsqueda arriba para explorar nuestro catálogo.</p>
          </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full bg-muted" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-muted" />
        <Skeleton className="h-4 w-1/2 bg-muted" />
        <Skeleton className="h-8 w-full bg-muted" />
      </div>
    </div>
  );
}
