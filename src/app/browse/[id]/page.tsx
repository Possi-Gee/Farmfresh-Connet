"use client";

import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, MapPin, Package, Phone } from "lucide-react";
import type { Produce } from "@/app/page";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

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
            phoneNumber: data.phoneNumber,
            hint: data.productName.toLowerCase(),
        };
    } else {
        return null;
    }
}


export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Produce | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!params.id) return;
        const fetchProduct = async () => {
            setLoading(true);
            const productData = await getProduceById(params.id);
            setProduct(productData);
            setLoading(false);
        }
        fetchProduct();
    }, [params.id]);

    const handleAddToCart = async () => {
        if (!user) {
            toast({ title: "Please sign in", description: "You need to be logged in to add items to your cart.", variant: "destructive" });
            router.push('/sign-in');
            return;
        }

        if (product) {
            try {
                await addDoc(collection(db, "cart", user.uid, "items"), {
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    unit: product.unit,
                    imageUrl: product.imageUrl,
                    quantity: 1, // Default quantity
                    addedAt: serverTimestamp(),
                });
                toast({ title: "Success!", description: `${product.name} has been added to your cart.` });
            } catch (error) {
                console.error("Error adding to cart: ", error);
                toast({ title: "Error", description: "Could not add item to cart. Please try again.", variant: "destructive" });
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    <Card className="overflow-hidden">
                        <Skeleton className="h-96 w-full" />
                    </Card>
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-12 w-3/4" />
                        <div className="flex items-center gap-4 mt-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                        <Skeleton className="h-24 w-full" />
                        <Card>
                            <CardContent className="p-6 flex flex-col gap-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

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
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{product.farmer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{product.location}</span>
                            </div>
                            {product.phoneNumber && (
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{product.phoneNumber}</span>
                                </div>
                            )}
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
                            <Button size="lg" className="w-full" onClick={handleAddToCart}>
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
