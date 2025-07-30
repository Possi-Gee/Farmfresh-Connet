
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

interface AuthUser extends User {
  accountType?: 'farmer' | 'buyer';
  displayName: string | null;
  phoneNumber?: string;
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
          const data = userDoc.data();
          userData.accountType = data?.accountType;
          userData.phoneNumber = data?.phoneNumber;
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

    // This prevents the hook from redirecting while on the auth pages,
    // which could interfere with the Firebase redirect result handling.
    const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
    if (isAuthPage) {
        getRedirectResult(auth).catch(error => {
            console.error("Error getting redirect result:", error);
        });
        return;
    };
    
    const isDashboardPage = pathname.startsWith('/dashboard');
    const isProfileCompletePage = pathname === '/dashboard/complete-profile';

    if (!user && isDashboardPage && !isProfileCompletePage) {
      router.push('/sign-in');
    } else if (user && isAuthPage) {
      router.push('/dashboard');
    } else if (user && !user.accountType && !isProfileCompletePage) {
      router.push('/dashboard/complete-profile');
    } else if (user && user.accountType && isProfileCompletePage) {
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
