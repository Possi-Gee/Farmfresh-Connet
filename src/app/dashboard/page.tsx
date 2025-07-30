"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [listingCount, setListingCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user?.accountType === 'farmer' && user.uid) {
      const fetchListings = async () => {
        try {
          setLoadingStats(true);
          const q = query(collection(db, "listings"), where("farmerId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          setListingCount(querySnapshot.size);
        } catch (error) {
          console.error("Error fetching listings count:", error);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchListings();
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
            <CardTitle>Total Listings</CardTitle>
            <CardDescription>Number of active produce listings.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-10 w-1/4" /> : <p className="text-4xl font-bold">{listingCount}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Views across all your listings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>New messages from buyers.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
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
