
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface ListingStats {
    count: number;
    totalViews: number;
}
interface OrderStats {
    count: number;
    totalRevenue: number;
}


export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [listingStats, setListingStats] = useState<ListingStats>({ count: 0, totalViews: 0 });
  const [orderStats, setOrderStats] = useState<OrderStats>({ count: 0, totalRevenue: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user?.accountType === 'farmer' && user.uid) {
      setLoadingStats(true);
      
      const listingsQuery = query(collection(db, "listings"), where("farmerId", "==", user.uid));
      const ordersQuery = query(collection(db, "orders"), where("farmerId", "==", user.uid));

      const unsubscribeListings = onSnapshot(listingsQuery, (querySnapshot) => {
        let totalViews = 0;
        querySnapshot.forEach(doc => {
            totalViews += doc.data().viewCount || 0;
        });
        setListingStats({ count: querySnapshot.size, totalViews });
      }, (error) => {
        console.error("Error fetching listings stats:", error);
      });
      
      const unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
        let totalRevenue = 0;
        querySnapshot.forEach(doc => {
            totalRevenue += doc.data().total || 0;
        });
        setOrderStats({ count: querySnapshot.size, totalRevenue });
      }, (error) => {
        console.error("Error fetching order stats:", error);
      });

      setLoadingStats(false);

      // Cleanup subscription on component unmount
      return () => {
        unsubscribeListings();
        unsubscribeOrders();
      };
    } else {
      setLoadingStats(false);
    }
  }, [user]);

  if (user?.accountType === 'buyer') {
    return (
      <div>
        <h1 className="text-3xl font-bold font-headline mb-6">Welcome, {user.displayName || 'Buyer'}!</h1>
        <Card>
          <CardHeader>
            <CardTitle>Start Exploring</CardTitle>
            <CardDescription>Find the freshest produce from local farmers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Browse Produce Listings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Farmer's Dashboard
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>From all completed sales.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-10 w-1/4" /> : <p className="text-4xl font-bold">GH₵{orderStats.totalRevenue.toFixed(2)}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>Number of orders received.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-10 w-1/4" /> : <p className="text-4xl font-bold">{orderStats.count}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Views across all your listings.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-10 w-1/4" /> : <p className="text-4xl font-bold">{listingStats.totalViews}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No recent activity to show.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    