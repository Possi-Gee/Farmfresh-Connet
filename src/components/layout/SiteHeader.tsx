"use client";

import Link from "next/link";
import { Leaf, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export function SiteHeader() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/sign-in');
  };

  const navLinks = [
    { href: "/", label: "Browse" },
    { href: "/dashboard/tips", label: "Farming Tips" },
  ];

  if (user) {
    navLinks.push({ href: "/dashboard", label: "Dashboard" });
  }

  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="ghost" asChild>
          <Link href={link.href} onClick={() => inSheet && setMenuOpen(false)}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

  const AuthButtons = () => {
    if (loading) {
      return <div className="flex gap-2"><Skeleton className="h-10 w-20" /><Skeleton className="h-10 w-20" /></div>;
    }

    if (user) {
      return (
        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      );
    }

    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  };
  
  const MobileAuthButtons = () => {
    if (loading) {
      return <div className="flex flex-col gap-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;
    }
  
    if (user) {
      return (
        <Button variant="outline" onClick={() => { handleSignOut(); setMenuOpen(false); }}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      );
    }
  
    return (
      <div className="flex flex-col space-y-2">
        <Button variant="outline" asChild>
          <Link href="/sign-in" onClick={() => setMenuOpen(false)}>Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              FarmFresh Connect
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-start space-x-2 md:flex">
          <NavLinks />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:flex">
            <AuthButtons />
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                    <Leaf className="mr-2 h-6 w-6 text-primary" />
                    <span className="font-bold">FarmFresh Connect</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="flex flex-col space-y-2">
                  <NavLinks inSheet />
                </div>
                <div className="mt-auto border-t pt-4">
                  <MobileAuthButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
