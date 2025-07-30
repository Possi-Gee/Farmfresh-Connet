"use client";

import Link from "next/link";
import { Leaf, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function SiteHeader() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Browse" },
    { href: "/dashboard/tips", label: "Farming Tips" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const NavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="ghost" asChild>
          <Link href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

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
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>
              <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                <Leaf className="mr-2 h-6 w-6 text-primary" />
                <span className="font-bold">FarmFresh Connect</span>
              </Link>
              <div className="mt-6 flex flex-col space-y-4">
                <NavLinks />
                <div className="border-t pt-4 flex flex-col space-y-2">
                  <Button variant="outline" asChild>
                    <Link href="/sign-in" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
