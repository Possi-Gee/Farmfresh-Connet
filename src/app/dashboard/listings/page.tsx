
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, deleteDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Listing extends DocumentData {
    id: string;
    productName: string;
    status: string;
    price: number;
    quantity: number;
    viewCount: number;
}

export default function MyListingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const q = query(collection(db, "listings"), where("farmerId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
                setListings(userListings);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching listings: ", error);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleDeleteListing = async (listingId: string) => {
        try {
            await deleteDoc(doc(db, "listings", listingId));
            toast({ title: "Success", description: "Listing deleted successfully." });
        } catch (error) {
            console.error("Error deleting listing: ", error);
            toast({ title: "Error", description: "Failed to delete listing. Please try again.", variant: "destructive" });
        }
    };

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
                <TableHead className="text-center">Views</TableHead>
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
                    <TableCell className="text-center">{listing.viewCount || 0}</TableCell>
                    <TableCell>
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                               <Link href={`/browse/${listing.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                listing for "{listing.productName}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteListing(listing.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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

    