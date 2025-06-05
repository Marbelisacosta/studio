
export interface Product {
  id: string; // Firestore document ID
  name: string;
  price?: string; // Formatted string e.g., "$19.99" - Ahora opcional
  stock: number; // Actual stock count, ensure this is always a number
  availability?: 'En Stock' | 'Agotado' | 'Poco Stock'; // Derivado del stock, ahora opcional
  imageUrl?: string;
  description?: string; 
  dataAiHint?: string; 
}

export type UserRoleType = 'admin' | 'employee' | 'client';

export interface UserProfile {
  id?: string; // Firestore document ID - opcional, principalmente para listas
  uid: string;
  email: string | null;
  role: UserRoleType;
  // Add other profile fields as needed
}

// Tipos para Pedidos
export type OrderStatusType = 'Pendiente' | 'En preparación' | 'Enviado' | 'Completado' | 'Cancelado';

export interface OrderItem {
  productId?: string; // Opcional, si queremos enlazar al producto
  name: string;
  quantity: number;
  price?: string; // Precio por unidad en el momento del pedido
}

export interface Order {
  id: string; // Firestore document ID
  orderId: string; // ID legible del pedido, ej: ORD001
  userId?: string; // ID del usuario que hizo el pedido (si aplica)
  customerEmail: string;
  items: OrderItem[];
  totalAmount: string; // Monto total formateado
  status: OrderStatusType;
  orderDate: any; // Debería ser un Timestamp de Firestore, pero 'any' para flexibilidad en la lectura inicial
  shippingAddress?: string;
}
