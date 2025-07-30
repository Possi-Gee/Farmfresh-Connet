import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Produce } from "@/app/page";
import { MapPin, ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Produce;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/browse/${product.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.hint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <CardTitle className="text-lg font-headline group-hover:text-primary">{product.name}</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            {product.location}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ {product.unit}</span>
          </p>
          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingCart className="mr-2 h-4 w-4"/>
            View
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
