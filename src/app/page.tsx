
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductSearch } from '@/components/products/ProductSearch';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product as ProductType } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchIcon as SearchIconLucide, Terminal, ShoppingBag, InfoIcon, Loader2 } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query as firestoreQuery, where, startAfter, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 8;
const FIRESTORE_COLLECTION_NAME = 'Productos'; // Nombre de la colección actualizado a "Productos"

export default function HomePage() {
  const [productsToDisplay, setProductsToDisplay] = useState<ProductType[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false); // For general product loading (initial/pagination)
  const [isSearching, setIsSearching] = useState(false); // Specifically for Genkit search
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // True if a Genkit search has been performed
  
  const [lastVisibleProduct, setLastVisibleProduct] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { currentUser, loading: authLoading } = useAuth();

  const fetchProductsFromFirestore = useCallback(async (loadMore = false) => {
    if (!hasMoreProducts && loadMore) return; 
    if (hasSearched && !loadMore) return; 

    setIsLoadingProducts(true);
    setSearchError(null);
    try {
      const productsCollectionRef = collection(db, FIRESTORE_COLLECTION_NAME); // Usar la constante
      let q;

      if (loadMore && lastVisibleProduct) {
        q = firestoreQuery(productsCollectionRef, orderBy("name"), startAfter(lastVisibleProduct), limit(PRODUCTS_PER_PAGE));
      } else {
        setProductsToDisplay([]); 
        q = firestoreQuery(productsCollectionRef, orderBy("name"), limit(PRODUCTS_PER_PAGE));
      }
      
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), stock: doc.data().stock ?? 0 } as ProductType));
      
      setProductsToDisplay(prevProducts => loadMore ? [...prevProducts, ...fetchedProducts] : fetchedProducts);
      
      if (querySnapshot.docs.length < PRODUCTS_PER_PAGE) {
        setHasMoreProducts(false);
      } else {
        setLastVisibleProduct(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMoreProducts(true);
      }
      if (!loadMore) setHasSearched(false);

    } catch (error) {
      console.error('Error fetching products from Firestore:', error);
      setSearchError('Error al cargar productos desde la base de datos.');
      if(!loadMore) setProductsToDisplay([]);
    } finally {
      setIsLoadingProducts(false);
      if(!loadMore) setInitialLoadComplete(true);
    }
  }, [lastVisibleProduct, hasMoreProducts, hasSearched]);

  useEffect(() => {
    if (!initialLoadComplete && !hasSearched) {
      fetchProductsFromFirestore(false);
    }
  }, [initialLoadComplete, hasSearched, fetchProductsFromFirestore]);


  const handleSearchResults = (products: ProductType[]) => {
    const searchedProductsWithStock = products.map(p => ({...p, stock: p.stock ?? Math.floor(Math.random() * 20)}));
    setProductsToDisplay(searchedProductsWithStock); 
    setHasSearched(true);
    setHasMoreProducts(false); 
    setInitialLoadComplete(true); 
  };

  const handleSearchLoading = (loading: boolean) => {
    setIsSearching(loading);
    if (loading) {
      setHasSearched(true); 
      setProductsToDisplay([]); 
    }
  };

  const handleSearchError = (error: string | null) => {
    setSearchError(error);
    setHasSearched(true);
    setProductsToDisplay([]);
  }
  
  const handleClearSearch = () => {
    setHasSearched(false);
    setSearchError(null);
    setLastVisibleProduct(null); 
    setHasMoreProducts(true);
    setInitialLoadComplete(false); 
  }

  const displayProducts = productsToDisplay;


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <Alert variant="default" className="mb-8 bg-primary/10 border-primary/30">
          <InfoIcon className="h-5 w-5 text-primary" />
          <AlertTitle className="font-bold text-primary">¡Bienvenido a Click Shop con Firebase!</AlertTitle>
          <AlertDescription className="text-primary/90">
            Esta versión integra Firebase Authentication. Los roles se leen/escriben en Firestore (<code>users</code> colección).
            Los productos se cargan desde Firestore (<code>{FIRESTORE_COLLECTION_NAME}</code> colección).
            La actualización de stock (empleados) simula una llamada a Cloud Function actualizando Firestore.
            <strong className="block mt-1">Importante:</strong> Configura tus credenciales de Firebase en <code>.env</code> para que funcione.
            Asegúrate de tener datos en tu colección <code>{FIRESTORE_COLLECTION_NAME}</code> de Firestore con campos <code>name (string)</code> y <code>stock (number)</code>.
          </AlertDescription>
        </Alert>

      <section className="mb-10 flex flex-col items-center">
        <ShoppingBag className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold mb-6 text-center text-foreground">
          Encuentra Tu Producto Perfecto
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Usa nuestra búsqueda inteligente Genkit. Los productos y el stock se gestionan con Firestore.
        </p>
        <div className="flex w-full max-w-xl items-center space-x-2">
          <ProductSearch
            onResults={handleSearchResults}
            onLoading={handleSearchLoading}
            onError={handleSearchError}
            isLoading={isSearching} 
          />
          {hasSearched && (
            <Button variant="outline" onClick={handleClearSearch}>Limpiar</Button>
          )}
        </div>
      </section>

      {searchError && (
         <Alert variant="destructive" className="mb-8 max-w-xl mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
      )}
      
      {(isLoadingProducts || (isSearching && displayProducts.length === 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoadingProducts && !isSearching && displayProducts.length === 0 && initialLoadComplete && !searchError && (
         <div className="text-center text-muted-foreground py-10">
            <SearchIconLucide className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl font-semibold">
              {hasSearched ? "No Se Encontraron Productos para tu Búsqueda" : "No Hay Productos en el Catálogo"}
            </p>
            <p>
              {hasSearched 
                ? "Intenta con diferentes palabras clave." 
                : "Asegúrate de haber añadido productos a tu base de datos Firestore."}
            </p>
             {hasSearched && <Button variant="link" onClick={handleClearSearch}>Ver todos los productos</Button>}
          </div>
      )}
      
      {displayProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-headline font-semibold mb-8 text-center text-foreground">
            {hasSearched ? "Resultados de Búsqueda" : "Nuestro Catálogo"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {!hasSearched && hasMoreProducts && !isLoadingProducts && (
            <div className="mt-8 text-center">
              <Button onClick={() => fetchProductsFromFirestore(true)} disabled={isLoadingProducts}>
                {isLoadingProducts ? <Loader2 className="animate-spin mr-2"/> : null}
                {isLoadingProducts ? "Cargando más..." : "Cargar Más Productos"}
              </Button>
            </div>
          )}
           {!hasSearched && !hasMoreProducts && initialLoadComplete && displayProducts.length > 0 && (
             <p className="text-center text-muted-foreground mt-8">Has llegado al final de nuestro catálogo.</p>
           )}
        </section>
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
        <Skeleton className="h-4 w-1/3 bg-muted" /> {/* For stock */}
        <Skeleton className="h-10 w-full bg-muted mt-2" /> {/* For badge and button area */}
      </div>
    </div>
  );
}
