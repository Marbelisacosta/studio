
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { DollarSign, PackageCheck, PackageX, ImageOff, Edit3, MinusSquare, PlusSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { Input } from '../ui/input';

interface ProductCardProps {
  product: Product;
}

const FIRESTORE_COLLECTION_NAME = 'Productos'; // Nombre de la colección actualizado a "Productos"

export function ProductCard({ product: initialProduct }: ProductCardProps) {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isLoadingStockUpdate, setIsLoadingStockUpdate] = useState(false);
  const [updateAmount, setUpdateAmount] = useState<number>(1);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);
  
  const currentStock = typeof product.stock === 'number' ? product.stock : 0;

  const getAvailabilityText = (stock: number): Product['availability'] => {
    if (stock > 10) return 'En Stock';
    if (stock > 0 && stock <=10) return 'Poco Stock';
    return 'Agotado';
  };
  
  const availabilityText = getAvailabilityText(currentStock);
  const isAvailable = currentStock > 0;
  const placeholderImage = "https://placehold.co/300x200.png";

  const handleUpdateStock = async (amount: number) => {
    if (!product.id || userRole !== 'employee') return;
    
    const newStockPreview = currentStock + amount;
    if (newStockPreview < 0) {
        toast({ title: "Error", description: "El stock no puede ser negativo.", variant: "destructive"});
        return;
    }

    setIsLoadingStockUpdate(true);
    try {
      const productRef = doc(db, FIRESTORE_COLLECTION_NAME, product.id); // Usar la constante
      await updateDoc(productRef, {
        stock: increment(amount)
      });
      
      const updatedDocSnap = await getDoc(productRef);
      const updatedProductData = updatedDocSnap.data() as Product | undefined;

      if (updatedProductData) {
        setProduct(prevProd => ({...prevProd, stock: updatedProductData.stock ?? 0}));
         toast({
            title: "Stock Actualizado",
            description: `Stock para "${product.name}" ahora es ${updatedProductData.stock ?? 0}. (Esto simuló una llamada a Cloud Function).`,
            variant: "default",
        });
      } else {
        throw new Error("No se pudo obtener el producto actualizado.");
      }

    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error al actualizar stock",
        description: (error as Error).message || "No se pudo actualizar el stock. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStockUpdate(false);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl h-full rounded-lg border">
      <CardHeader className="p-0 relative aspect-[3/2] w-full bg-muted">
        {product.imageUrl || placeholderImage ? (
          <Image
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={product.dataAiHint || product.name.split(' ').slice(0,2).join(' ').toLowerCase() || "articulo producto"}
            onError={(e) => { e.currentTarget.srcset = placeholderImage; e.currentTarget.src = placeholderImage; }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageOff className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="text-lg font-headline mb-2 truncate" title={product.name}>
          {product.name}
        </CardTitle>
        
        {product.price && (
          <div className="flex items-center text-foreground">
            <DollarSign className="h-5 w-5 mr-1 text-primary" />
            <p className="text-xl font-semibold">{product.price}</p>
          </div>
        )}

        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Stock: {currentStock}</p>
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <Badge variant={isAvailable ? 'default' : 'destructive'} className="w-full justify-center py-2 text-sm mb-3">
            {isAvailable ? <PackageCheck className="mr-2 h-4 w-4" /> : <PackageX className="mr-2 h-4 w-4" />}
            {availabilityText}
        </Badge>
        
        {userRole === 'employee' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleUpdateStock(-updateAmount)} disabled={isLoadingStockUpdate || updateAmount <=0}>
                {isLoadingStockUpdate ? <Loader2 className="animate-spin h-4 w-4"/> : <MinusSquare className="h-4 w-4" />}
              </Button>
              <Input 
                type="number"
                value={updateAmount}
                onChange={(e) => setUpdateAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center h-9"
                min="1"
                disabled={isLoadingStockUpdate}
              />
              <Button variant="outline" size="icon" onClick={() => handleUpdateStock(updateAmount)} disabled={isLoadingStockUpdate || updateAmount <=0}>
                 {isLoadingStockUpdate ? <Loader2 className="animate-spin h-4 w-4"/> : <PlusSquare className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => toast({title:"Información de Actualización de Stock", description:"Utiliza los botones +/- y el campo numérico para ajustar la cantidad de stock a sumar o restar. La actualización se realiza directamente en Firestore (simulando una Cloud Function protegida).", duration: 7000})}
              disabled={isLoadingStockUpdate}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Ajustar Stock
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
