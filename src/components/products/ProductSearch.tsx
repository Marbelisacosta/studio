
'use client';

import { useState } from 'react';
import { searchProducts, type SearchProductsInput } from '@/ai/flows/search-products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon } from 'lucide-react';
// ProductType ya no se necesita aquí directamente para crear productos ficticios

interface ProductSearchProps {
  onResults: (productNames: string[]) => void; // Cambiado: ahora pasa string[]
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
  isLoading: boolean;
}

export function ProductSearch({ onResults, onLoading, onError, isLoading }: ProductSearchProps) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      onResults([]); 
      return;
    }
    onLoading(true);
    onError(null);
    try {
      const input: SearchProductsInput = { query };
      const output = await searchProducts(input);
      // Simplemente pasar los nombres de los productos devueltos por la IA
      onResults(output.products); 
    } catch (error) {
      console.error('Search failed:', error);
      onError('Error al buscar productos con IA. Por favor, inténtalo de nuevo.');
      onResults([]);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex w-full max-w-xl items-center space-x-2"
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos por nombre o características..."
        className="flex-grow rounded-md"
        aria-label="Buscar productos"
      />
      <Button type="submit" disabled={isLoading} className="rounded-md">
        {isLoading ? <Loader2 className="animate-spin" /> : <SearchIcon />}
        <span className="ml-2 hidden sm:inline">Buscar</span>
      </Button>
    </form>
  );
}
