
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { UserRoleType, UserProfile, Order, OrderStatusType } from '@/types';


interface AuthContextType {
  currentUser: FirebaseUser | null;
  userRole: UserRoleType | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUserRoleInFirestore: (uid: string, newRole: UserRoleType) => Promise<void>;
  getAllUsersFromFirestore: () => Promise<UserProfile[]>;
  getOrdersFromFirestore: () => Promise<Order[]>;
  updateOrderStatusInFirestore: (orderId: string, newStatus: OrderStatusType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRoleType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data()?.role as UserRoleType || null);
            } else {
            setUserRole(null); 
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const updateUserRoleInFirestore = async (uid: string, newRole: UserRoleType) => {
    if (!uid || !newRole) throw new Error("UID y nuevo rol son requeridos para actualizar en Firestore.");
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, { role: newRole });
      console.log(`Usuario ${uid} actualizado con rol ${newRole} en Firestore.`);
    } catch (error) {
      console.error("Error al actualizar el rol del usuario en Firestore:", error);
      throw error;
    }
  };

  const getAllUsersFromFirestore = async (): Promise<UserProfile[]> => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as UserProfile));
      return usersList.filter(user => user.uid); 
    } catch (error) {
      console.error("Error al obtener todos los usuarios de Firestore:", error);
      throw error;
    }
  };

  const getOrdersFromFirestore = async (): Promise<Order[]> => {
    try {
      const ordersCollectionRef = collection(db, 'Orders');
      // Ordenar por fecha, los más recientes primero (si tienes un campo de fecha adecuado)
      const q = query(ordersCollectionRef, orderBy("orderDate", "desc"));
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        // Convert Firestore Timestamp to Date if necessary, or handle as is
        // For simplicity, ensure orderDate is usable. If it's a Firestore Timestamp,
        // you might want to convert it to a JS Date object or a string here.
        // For now, we'll pass it as is.
        return { id: docSnap.id, ...data } as Order;
      });
      return ordersList;
    } catch (error) {
      console.error("Error al obtener los pedidos de Firestore:", error);
      throw error;
    }
  };

  const updateOrderStatusInFirestore = async (orderDocumentId: string, newStatus: OrderStatusType) => {
    if (!orderDocumentId || !newStatus) throw new Error("ID del pedido y nuevo estado son requeridos.");
    try {
      const orderDocRef = doc(db, 'Orders', orderDocumentId);
      await updateDoc(orderDocRef, { status: newStatus });
      console.log(`Pedido ${orderDocumentId} actualizado con estado ${newStatus} en Firestore.`);
    } catch (error) {
      console.error("Error al actualizar el estado del pedido en Firestore:", error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, logout, updateUserRoleInFirestore, getAllUsersFromFirestore, getOrdersFromFirestore, updateOrderStatusInFirestore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const registerUserWithRoleInFirestore = async (uid: string, email: string | null, role: UserRoleType) => {
  if (!uid || !role) throw new Error("UID y rol son requeridos para el registro en Firestore.");
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { uid, email: email ?? 'No disponible', role }, { merge: true });
    console.log(`Usuario ${uid} registrado con rol ${role} en Firestore.`);
  } catch (error) {
    console.error("Error al establecer el rol del usuario en Firestore durante el registro:", error);
    throw error; 
  }
};
