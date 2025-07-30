"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing extends DocumentData {
    id: string;
    productName: string;
    status: string;
    price: number;
    quantity: number;
}

export default function MyListingsPage() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchListings = async () => {
                setLoading(true);
                const q = query(collection(db, "listings"), where("farmerId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const userListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
                setListings(userListings);
                setLoading(false);
            };
            fetchListings();
        }
    }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Produce Listings</CardTitle>
        <CardDescription>Manage your current and past listings.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listings.map((listing) => (
                <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.productName}</TableCell>
                    <TableCell>
                    <Badge variant={listing.status === 'Active' ? 'default' : 'outline'}>{listing.status}</Badge>
                    </TableCell>
                    <TableCell>GH₵{listing.price.toFixed(2)}</TableCell>
                    <TableCell>{listing.quantity}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven&apos;t created any listings yet.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/listings/new">Create First Listing</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
