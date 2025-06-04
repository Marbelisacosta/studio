'use client';

import { useState } from 'react';
import { searchProducts, type SearchProductsInput } from '@/ai/flows/search-products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon } from 'lucide-react';
import type { Product } from '@/types';

interface ProductSearchProps {
  onResults: (products: Product[]) => void;
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
      const products = output.products.map((name, index) => {
        const randomAvailability = Math.random();
        let availabilityText: Product['availability'];
        if (randomAvailability > 0.6) {
          availabilityText = 'En Stock';
        } else if (randomAvailability > 0.2) {
          availabilityText = 'Poco Stock';
        } else {
          availabilityText = 'Agotado';
        }
        return {
          id: `${name.replace(/\s+/g, '-').toLowerCase()}-${index}`,
          name,
          price: `$${(Math.random() * 100 + 10).toFixed(2)}`, // Placeholder price
          availability: availabilityText,
          imageUrl: `https://placehold.co/300x200.png`, // Placeholder image
          dataAiHint: name.split(' ').slice(0,2).join(' ').toLowerCase() || 'producto moda', // Placeholder AI hint in Spanish
        };
      });
      onResults(products);
    } catch (error) {
      console.error('Search failed:', error);
      onError('Error al buscar productos. Por favor, inténtalo de nuevo.');
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
