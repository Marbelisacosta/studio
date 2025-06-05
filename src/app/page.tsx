
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductSearch } from '@/components/products/ProductSearch';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product as ProductType } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchIcon as SearchIconLucide, Terminal, Archive, InfoIcon, Loader2, Store } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query as firestoreQuery, where, startAfter, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 8;
const FIRESTORE_COLLECTION_NAME = 'Productos';

export default function HomePage() {
  const [productsToDisplay, setProductsToDisplay] = useState<ProductType[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [lastVisibleProduct, setLastVisibleProduct] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { currentUser, userRole, loading: authLoading } = useAuth();

  const isEmployeeOrAdmin = currentUser && (userRole === 'admin' || userRole === 'employee');

  const pageTitle = isEmployeeOrAdmin ? "Gestiona el Inventario de Productos" : "Nuestro Catálogo de Productos";
  const pageDescription = isEmployeeOrAdmin 
    ? "Usa la búsqueda inteligente para encontrar productos rápidamente y actualiza sus niveles de stock (entradas/salidas)."
    : "Explora nuestra selección de productos. La búsqueda inteligente te ayudará a encontrar lo que necesitas.";
  const PageIcon = isEmployeeOrAdmin ? Archive : Store;
  const mainContentTitle = hasSearched 
    ? "Resultados de Búsqueda" 
    : isEmployeeOrAdmin ? "Inventario de Productos" : "Productos Destacados";


  const fetchInitialProducts = useCallback(async (loadMore = false) => {
    if (!hasMoreProducts && loadMore) return; 
    
    setIsLoadingProducts(true);
    setSearchError(null);
    try {
      const productsCollectionRef = collection(db, FIRESTORE_COLLECTION_NAME);
      let q;

      if (loadMore && lastVisibleProduct) {
        q = firestoreQuery(productsCollectionRef, orderBy("name"), startAfter(lastVisibleProduct), limit(PRODUCTS_PER_PAGE));
      } else {
        if (!loadMore) setProductsToDisplay([]); 
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
    } catch (error) {
      console.error('Error fetching products from Firestore:', error);
      setSearchError('Error al cargar productos desde la base de datos.');
      if(!loadMore) setProductsToDisplay([]);
    } finally {
      setIsLoadingProducts(false);
      if(!loadMore) setInitialLoadComplete(true);
    }
  }, [lastVisibleProduct, hasMoreProducts]);

  useEffect(() => {
    if (!initialLoadComplete && !hasSearched) {
      fetchInitialProducts(false);
    }
  }, [initialLoadComplete, hasSearched, fetchInitialProducts]);


  const fetchProductsByNamesFromFirestore = async (names: string[]) => {
    if (names.length === 0) {
      setProductsToDisplay([]);
      setSearchError(null);
      setIsLoadingProducts(false);
      setHasSearched(true);
      setHasMoreProducts(false); 
      setInitialLoadComplete(true);
      return;
    }

    setIsLoadingProducts(true);
    setSearchError(null);
    setProductsToDisplay([]); 
    setLastVisibleProduct(null); 

    try {
      const productsRef = collection(db, FIRESTORE_COLLECTION_NAME);
      const q = firestoreQuery(productsRef, where('name', 'in', names.slice(0, 30))); 
      const querySnapshot = await getDocs(q);
      const foundProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), stock: doc.data().stock ?? 0 } as ProductType));
      setProductsToDisplay(foundProducts);
      setHasMoreProducts(false); 
    } catch (error) {
      console.error('Error fetching searched products from Firestore:', error);
      setSearchError('Error al buscar productos coincidentes en la base de datos.');
      setProductsToDisplay([]);
    } finally {
      setIsLoadingProducts(false);
      setHasSearched(true);
      setInitialLoadComplete(true);
    }
  };

  const handleAiSearchResults = (productNames: string[]) => {
    fetchProductsByNamesFromFirestore(productNames);
  };

  const handleSearchLoading = (loading: boolean) => {
    setIsSearchingAi(loading);
    if (loading) {
      setHasSearched(true);
      setProductsToDisplay([]);
      setSearchError(null);
      setIsLoadingProducts(true); 
    }
  };

  const handleSearchError = (error: string | null) => {
    setSearchError(error);
    setHasSearched(true);
    setProductsToDisplay([]);
    setIsLoadingProducts(false);
  }
  
  const handleClearSearch = () => {
    setHasSearched(false);
    setSearchError(null);
    setLastVisibleProduct(null); 
    setHasMoreProducts(true);
    setInitialLoadComplete(false); 
  }

  const displayProducts = productsToDisplay;
  const showSkeletons = isSearchingAi || (isLoadingProducts && !isSearchingAi && !initialLoadComplete);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <Alert variant="default" className="mb-8 bg-primary/10 border-primary/30">
          <InfoIcon className="h-5 w-5 text-primary" />
          <AlertTitle className="font-bold text-primary">
            {isEmployeeOrAdmin ? "Gestión de Inventario Click Shop con Firebase" : "Bienvenido a Click Shop"}
          </AlertTitle>
          <AlertDescription className="text-primary/90">
            {isEmployeeOrAdmin 
              ? `Esta aplicación te permite gestionar el stock de tus productos. Utiliza Firebase Authentication para los roles (empleado/admin) y Firestore para almacenar los productos (${FIRESTORE_COLLECTION_NAME} colección) y usuarios (users colección). Las actualizaciones de stock (entradas/salidas) se realizan directamente en Firestore.`
              : `Explora nuestros productos. Si eres un empleado o administrador, inicia sesión para acceder a las herramientas de gestión de inventario.`
            }
            {isEmployeeOrAdmin && !process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY && 
              <strong className="block mt-1 text-destructive">Importante: La búsqueda inteligente de productos podría no funcionar si la API Key de Google AI no está configurada en <code>.env</code>.</strong>
            }
            {isEmployeeOrAdmin && ` Asegúrate de tener datos en tu colección ${FIRESTORE_COLLECTION_NAME} de Firestore con campos name (string) y stock (number).`}
          </AlertDescription>
        </Alert>

      <section className="mb-10 flex flex-col items-center">
        <PageIcon className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold mb-6 text-center text-foreground">
          {pageTitle}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          {pageDescription}
        </p>
        <div className="flex w-full max-w-xl items-center space-x-2">
          <ProductSearch
            onResults={handleAiSearchResults}
            onLoading={handleSearchLoading}
            onError={handleSearchError}
            isLoading={isSearchingAi} 
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
      
      {showSkeletons && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!showSkeletons && displayProducts.length === 0 && initialLoadComplete && !searchError && (
         <div className="text-center text-muted-foreground py-10">
            <SearchIconLucide className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl font-semibold">
              {hasSearched ? "No se encontraron productos para tu búsqueda." : "No hay productos para mostrar."}
            </p>
            <p>
              {hasSearched 
                ? "Intenta con diferentes palabras clave." 
                : isEmployeeOrAdmin ? "Asegúrate de haber añadido productos a tu base de datos Firestore." : "Vuelve más tarde para ver nuestro catálogo."}
            </p>
             {hasSearched && <Button variant="link" onClick={handleClearSearch}>Ver todos los productos</Button>}
          </div>
      )}
      
      {!showSkeletons && displayProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-headline font-semibold mb-8 text-center text-foreground">
            {mainContentTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {!hasSearched && hasMoreProducts && !isLoadingProducts && (
            <div className="mt-8 text-center">
              <Button onClick={() => fetchInitialProducts(true)} disabled={isLoadingProducts}>
                {isLoadingProducts ? <Loader2 className="animate-spin mr-2"/> : null}
                {isLoadingProducts ? "Cargando más..." : "Cargar Más Productos"}
              </Button>
            </div>
          )}
           {!hasSearched && !hasMoreProducts && initialLoadComplete && displayProducts.length > 0 && (
             <p className="text-center text-muted-foreground mt-8">
                {isEmployeeOrAdmin ? "Has llegado al final del inventario." : "Has visto todos nuestros productos destacados."}
             </p>
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
        <Skeleton className="h-4 w-1/3 bg-muted" /> 
        <Skeleton className="h-10 w-full bg-muted mt-2" /> 
      </div>
    </div>
  );
}

