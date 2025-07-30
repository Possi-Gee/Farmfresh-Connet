
"use client";

import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { format } from "date-fns";

interface OrderItem {
    productName: string;
    price: number;
    quantity: number;
    unit: string;
    imageUrl: string;
}

interface Order extends DocumentData {
    id: string;
    items: OrderItem[];
    status: "Pending" | "Shipped" | "Delivered";
    total: number;
    createdAt: Timestamp;
}

export default function MyOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const q = query(collection(db, "orders"), where("buyerId", "==", user.uid));
            
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order)).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                setOrders(userOrders);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">My Orders</h1>
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {orders.map(order => (
                        <AccordionItem key={order.id} value={order.id} className="border rounded-lg">
                            <AccordionTrigger className="p-6 hover:no-underline">
                                <div className="flex justify-between w-full">
                                    <div>
                                        <p className="font-bold">Order #{order.id.slice(0, 6)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(order.createdAt.toDate(), "PPP")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>
                                            {order.status}
                                        </Badge>
                                        <p className="font-bold text-lg">GH₵{order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <h4 className="font-semibold mb-2">Items:</h4>
                                <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden mr-4">
                                            <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} {item.unit} x GH₵{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}


    