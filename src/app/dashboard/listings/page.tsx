import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const listings = [
  { id: "1", name: "Organic Tomatoes", status: "Active", price: 3.99, quantity: 50, },
  { id: "3", name: "Sweet Corn", status: "Active", price: 2.50, quantity: 200, },
  { id: "5", name: "Habanero Peppers", status: "Inactive", price: 8.50, quantity: 0, },
];

export default function MyListingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Produce Listings</CardTitle>
        <CardDescription>Manage your current and past listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.name}</TableCell>
                <TableCell>
                  <Badge variant={listing.status === 'Active' ? 'default' : 'outline'}>{listing.status}</Badge>
                </TableCell>
                <TableCell>${listing.price.toFixed(2)}</TableCell>
                <TableCell>{listing.quantity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {listings.length === 0 && (
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
