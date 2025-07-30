import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, MapPin, Package } from "lucide-react";
import type { Produce } from "@/app/page";

async function getProduceById(id: string): Promise<Produce | null> {
    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            name: data.productName,
            category: data.category,
            price: data.price,
            unit: data.unit,
            quantity: data.quantity,
            location: data.location,
            imageUrl: data.imageUrl,
            farmer: data.farmerName || 'Anonymous Farmer',
            description: data.description,
            hint: data.productName.toLowerCase(),
        };
    } else {
        return null;
    }
}


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProduceById(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto py-12">
            <div className="grid md:grid-cols-2 gap-12">
                <Card className="overflow-hidden">
                    <div className="relative h-96 w-full">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={product.hint}
                        />
                    </div>
                </Card>

                <div className="flex flex-col gap-6">
                    <div>
                        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                        <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{product.farmer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{product.location}</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-lg">{product.description}</p>
                    
                    <Card>
                        <CardContent className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <p className="text-3xl font-bold text-primary">
                                    GH₵{product.price.toFixed(2)}
                                    <span className="text-base font-normal text-muted-foreground"> / {product.unit}</span>
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Package className="h-5 w-5" />
                                    <span>{product.quantity} available</span>
                                </div>
                            </div>
                            <Button size="lg" className="w-full">
                                <ShoppingCart className="mr-2" />
                                Add to Cart
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
