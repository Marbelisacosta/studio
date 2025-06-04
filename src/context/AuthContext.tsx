
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { UserRoleType } from '@/types';


interface AuthContextType {
  currentUser: FirebaseUser | null;
  userRole: UserRoleType | null;
  loading: boolean;
  logout: () => Promise<void>;
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
            // User document might not exist yet if registration is multi-step
            // or if role is assigned later by an admin.
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
      // State updates (currentUser, userRole) will be handled by onAuthStateChanged
      // No need to clear localStorage manually if we stop using it for roles
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, logout }}>
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
    await setDoc(userDocRef, { uid, email, role }, { merge: true });
    console.log(`Usuario ${uid} registrado con rol ${role} en Firestore.`);
  } catch (error) {
    console.error("Error al establecer el rol del usuario en Firestore durante el registro:", error);
    throw error; 
  }
};
