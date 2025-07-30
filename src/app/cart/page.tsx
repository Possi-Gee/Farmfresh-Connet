"use client";

import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
    id: string;
    productName: string;
    price: number;
    unit: string;
    imageUrl: string;
    quantity: number;
}

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "cart", user.uid, "items"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const items: CartItem[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as CartItem);
                });
                setCartItems(items);
                setLoading(false);
            });
            return () => unsubscribe();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleRemoveItem = async (itemId: string) => {
        if (user) {
            try {
                await deleteDoc(doc(db, "cart", user.uid, "items", itemId));
                toast({ title: "Item removed", description: "The item has been removed from your cart." });
            } catch (error) {
                console.error("Error removing item: ", error);
                toast({ title: "Error", description: "Could not remove item. Please try again.", variant: "destructive" });
            }
        }
    }

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">My Cart</h1>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
             <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2">You are not logged in</h2>
                <p className="text-muted-foreground mb-4">Please sign in to view your cart.</p>
                <Button asChild>
                    <Link href="/sign-in">Sign In</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">My Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <Card key={item.id} className="flex items-center p-4">
                                <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.productName}</h3>
                                    <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
                                    <p className="font-bold text-primary">GH₵{item.price.toFixed(2)}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove item</span>
                                </Button>
                            </Card>
                        ))}
                    </div>
                    <div className="md:col-span-1">
                       <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>GH₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>TBD</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>GH₵{cartTotal.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Proceed to Checkout</Button>
                            </CardFooter>
                       </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

    