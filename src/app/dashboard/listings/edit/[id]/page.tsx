
"use client";

import { ListingForm } from "@/components/forms/ListingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Listing } from "@/app/dashboard/listings/page";
import { Skeleton } from "@/components/ui/skeleton";

async function getListingById(id: string): Promise<Listing | null> {
    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Listing;
    } else {
        return null;
    }
}


export default function EditListingPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getListingById(id).then(data => {
        setListing(data);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Edit Listing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Product Details</CardTitle>
          <CardDescription>Make changes to your listing below.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : listing ? (
                <ListingForm listing={listing} />
            ) : (
                <p>Listing not found.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
