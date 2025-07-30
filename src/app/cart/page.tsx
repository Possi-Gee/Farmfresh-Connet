
"use client";

import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, writeBatch, serverTimestamp, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import type { Produce } from "@/app/page";

interface CartItem {
    id: string;
    productId: string;
    productName: string;
    price: number;
    unit: string;
    imageUrl: string;
    quantity: number;
    farmerId: string; // Add farmerId to cart item
}

async function getProduceById(id: string): Promise<(Produce & { farmerId: string }) | null> {
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
            farmerId: data.farmerId,
        };
    } else {
        return null;
    }
}


export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "cart", user.uid, "items"));
            const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                const items: CartItem[] = [];
                for (const itemDoc of querySnapshot.docs) {
                    const itemData = itemDoc.data();
                    const product = await getProduceById(itemData.productId);
                    if (product) {
                        items.push({ 
                            id: itemDoc.id, 
                            ...itemData,
                            farmerId: product.farmerId,
                        } as CartItem);
                    }
                }
                setCartItems(items);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching cart items:", error);
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

    const handleCheckout = async () => {
        if (!user || cartItems.length === 0) return;

        setCheckoutLoading(true);

        const ordersByFarmer = cartItems.reduce((acc, item) => {
            (acc[item.farmerId] = acc[item.farmerId] || []).push(item);
            return acc;
        }, {} as Record<string, CartItem[]>);

        try {
            const batch = writeBatch(db);

            for (const farmerId in ordersByFarmer) {
                const farmerItems = ordersByFarmer[farmerId];
                const total = farmerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                const orderData = {
                    buyerId: user.uid,
                    buyerName: user.displayName || 'Anonymous Buyer',
                    farmerId: farmerId,
                    items: farmerItems.map(({ id, ...rest }) => rest), // remove cart item id
                    total,
                    status: "Pending",
                    createdAt: serverTimestamp(),
                };
                const orderRef = doc(collection(db, "orders"));
                batch.set(orderRef, orderData);
            }
            
            // Clear the cart
            cartItems.forEach(item => {
                const itemRef = doc(db, "cart", user.uid, "items", item.id);
                batch.delete(itemRef);
            });

            await batch.commit();

            toast({ title: "Checkout Successful!", description: "Your order has been placed." });
            router.push("/dashboard/my-orders");

        } catch (error) {
            console.error("Error during checkout:", error);
            toast({ title: "Checkout Failed", description: "There was an error placing your order. Please try again.", variant: "destructive" });
        } finally {
            setCheckoutLoading(false);
        }
    };


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
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove item</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action will remove "{item.productName}" from your cart.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleRemoveItem(item.id)}>Remove</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
                                <Button className="w-full" onClick={handleCheckout} disabled={checkoutLoading}>
                                    {checkoutLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Proceed to Checkout
                                </Button>
                            </CardFooter>
                       </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
