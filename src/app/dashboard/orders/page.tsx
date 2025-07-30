
"use client";

import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, DocumentData, Timestamp, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Truck, CheckCircle } from "lucide-react";

interface OrderItem {
    productName: string;
    price: number;
    quantity: number;
    unit: string;
}

interface Order extends DocumentData {
    id: string;
    buyerName: string;
    buyerPhoneNumber: string;
    items: OrderItem[];
    status: "Pending" | "Shipped" | "Delivered";
    total: number;
    createdAt: Timestamp;
}

export default function FarmerOrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.accountType === 'farmer') {
            setLoading(true);
            const q = query(collection(db, "orders"), where("farmerId", "==", user.uid));
            
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const farmerOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order)).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                setOrders(farmerOrders);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleUpdateStatus = async (orderId: string, status: "Pending" | "Shipped" | "Delivered") => {
        const orderRef = doc(db, "orders", orderId);
        try {
            await updateDoc(orderRef, { status });
            toast({ title: "Order Updated", description: `Order has been marked as ${status}.` });
        } catch (error) {
            console.error("Error updating order status:", error);
            toast({ title: "Update Failed", description: "Could not update the order status.", variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Received Orders</CardTitle>
                    <CardDescription>Manage orders for your products.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Received Orders</CardTitle>
                <CardDescription>Manage orders for your products.</CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>You haven&apos;t received any orders yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Buyer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id.slice(0, 6)}</TableCell>
                                    <TableCell>{format(order.createdAt.toDate(), "PP")}</TableCell>
                                    <TableCell>{order.buyerName}</TableCell>
                                    <TableCell>{order.buyerPhoneNumber}</TableCell>
                                    <TableCell>{order.items.map(item => item.productName).join(', ')}</TableCell>
                                    <TableCell>GH₵{order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "Shipped")}>
                                                    <Truck className="mr-2 h-4 w-4" />
                                                    Mark as Shipped
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "Delivered")}>
                                                     <CheckCircle className="mr-2 h-4 w-4" />
                                                    Mark as Delivered
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
