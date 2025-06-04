
export interface Product {
  id: string; // Firestore document ID
  name: string;
  price?: string; // Formatted string e.g., "$19.99"
  stock: number; // Actual stock count, ensure this is always a number
  availability?: 'En Stock' | 'Agotado' | 'Poco Stock'; // This could be derived from stock count
  imageUrl?: string;
  description?: string; 
  dataAiHint?: string; 
}

export type UserRoleType = 'admin' | 'employee' | 'client';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRoleType;
  // Add other profile fields as needed
}
