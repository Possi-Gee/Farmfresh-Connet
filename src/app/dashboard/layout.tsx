"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Crop, Lightbulb, Package, LayoutDashboard, ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const farmerNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Listings",
    href: "/dashboard/listings",
    icon: Package,
  },
  {
    title: "Add Listing",
    href: "/dashboard/listings/new",
    icon: Crop,
  },
  {
    title: "AI Farming Tips",
    href: "/dashboard/tips",
    icon: Lightbulb,
  },
];

const buyerNavItems = [
    {
      title: "Browse Produce",
      href: "/",
      icon: ShoppingCart,
    },
    {
        title: "AI Farming Tips",
        href: "/dashboard/tips",
        icon: Lightbulb,
    },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const sidebarNavItems = user?.accountType === 'farmer' ? farmerNavItems : buyerNavItems;

  const Nav = () => (
    <nav className="grid items-start gap-2">
    {sidebarNavItems.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent" : "transparent"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </span>
        </Link>
      )
    })}
    </nav>
  );

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-8">
      <aside className="hidden w-[200px] flex-col md:flex">
        <Nav />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="md:hidden mb-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-4 w-4" />
                        <span className="sr-only">Open navigation</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px]">
                    <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
                    <Nav/>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        {children}
      </main>
    </div>
  );
}