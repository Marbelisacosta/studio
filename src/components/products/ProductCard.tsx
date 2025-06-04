import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { DollarSign, PackageCheck, PackageX, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.availability === 'In Stock' || product.availability === 'Low Stock';
  const placeholderImage = "https://placehold.co/300x200.png";

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
            data-ai-hint={product.dataAiHint || product.name.split(' ').slice(0,2).join(' ').toLowerCase() || "product item"}
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
          <div className="flex items-center text-foreground mt-auto pt-2">
            <DollarSign className="h-5 w-5 mr-1 text-primary" />
            <p className="text-xl font-semibold">{product.price}</p>
          </div>
        )}
      </CardContent>
      {product.availability && (
         <div className="p-4 pt-0">
          <Badge variant={isAvailable ? 'default' : 'destructive'} className="w-full justify-center py-2 text-sm">
            {isAvailable ? <PackageCheck className="mr-2 h-4 w-4" /> : <PackageX className="mr-2 h-4 w-4" />}
            {product.availability}
          </Badge>
        </div>
      )}
    </Card>
  );
}
