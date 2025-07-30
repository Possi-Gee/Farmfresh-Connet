"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

interface AuthUser extends User {
  accountType?: 'farmer' | 'buyer';
  displayName: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        const userData: AuthUser = {
          ...firebaseUser,
          displayName: firebaseUser.displayName,
          accountType: undefined,
        };

        if (userDoc.exists()) {
          userData.accountType = userDoc.data()?.accountType;
        }
        setUser(userData);

      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
    const isDashboardPage = pathname.startsWith('/dashboard');

    if (!user && isDashboardPage) {
      router.push('/sign-in');
    } else if (user && isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
