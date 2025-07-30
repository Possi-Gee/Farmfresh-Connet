import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { collection, getDocs, query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
      hint: data.productName.toLowerCase(), // Use product name for hint
    });
  });
  return produceList;
}


export default async function Home() {
  const produce = await getProduce();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <FilterSidebar />
        </div>
        <div className="col-span-1 md:col-span-3">
          <h1 className="text-3xl font-headline font-bold mb-6">Fresh Produce</h1>
          {produce.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produce.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border-2 border-dashed">
                <h2 className="text-2xl font-bold mb-2">No Produce Available Yet</h2>
                <p className="text-muted-foreground mb-4">Check back soon for fresh listings from our farmers!</p>
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
