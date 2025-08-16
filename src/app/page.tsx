
"use client";

import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { collection, getDocs, query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type Produce = {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    location: string;
    imageUrl: string;
    farmer: string;
    hint: string;
    description?: string;
    phoneNumber?: string;
    viewCount?: number;
};

async function getProduce(): Promise<Produce[]> {
  const listingsCol = collection(db, 'listings');
  const q = query(listingsCol, orderBy('createdAt', 'desc'));
  const listingsSnapshot = await getDocs(q);
  const produceList: Produce[] = [];
  listingsSnapshot.forEach((doc: DocumentData) => {
    const data = doc.data();
    produceList.push({
      id: doc.id,
      name: data.productName,
      category: data.category,
      price: data.price,
      unit: data.unit,
      quantity: data.quantity,
      location: data.location,
      imageUrl: data.imageUrl,
      farmer: data.farmerName || 'Anonymous Farmer',
      description: data.description || '',
      phoneNumber: data.phoneNumber || '',
      hint: (data.productName || '').toLowerCase(),
      viewCount: data.viewCount || 0,
    });
  });
  return produceList;
}

export default function Home() {
  const [allProduce, setAllProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");

  useEffect(() => {
    const fetchProduce = async () => {
      setLoading(true);
      const produceData = await getProduce();
      setAllProduce(produceData);
      setLoading(false);
    };
    fetchProduce();
  }, []);

  const filteredProduce = useMemo(() => {
    return allProduce.filter(item => {
      const matchesSearch = searchTerm === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || item.category.toLowerCase() === category.toLowerCase();
      const matchesRegion = region === "all" || item.location === region;
      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [allProduce, searchTerm, category, region]);

  const ProductListSkeletons = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[192px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <FilterSidebar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            category={category}
            setCategory={setCategory}
            region={region}
            setRegion={setRegion}
          />
        </div>
        <div className="col-span-1 md:col-span-3">
          <h1 className="text-3xl font-headline font-bold mb-6">Fresh Produce</h1>
          {loading ? (
            <ProductListSkeletons />
          ) : filteredProduce.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProduce.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border-2 border-dashed">
                <h2 className="text-2xl font-bold mb-2">No Produce Found</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your search filters, or check back soon!</p>
                <p className="text-sm text-muted-foreground">Are you a farmer? 
                    <Button variant="link" asChild className="p-1">
                        <Link href="/dashboard/listings/new">
                            Add a listing
                        </Link>
                    </Button>
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
