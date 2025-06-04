export interface Product {
  id: string;
  name: string;
  price?: string; // Formatted string e.g., "$19.99"
  availability?: 'En Stock' | 'Agotado' | 'Poco Stock';
  imageUrl?: string;
  description?: string; // For product details page later
  dataAiHint?: string; // For placeholder image search
}
