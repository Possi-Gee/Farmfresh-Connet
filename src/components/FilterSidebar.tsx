"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const regions = [
  "Ashanti", "Bono", "Bono East", "Ahafo", "Central", "Eastern",
  "Greater Accra", "Northern", "Savannah", "North East", "Upper East",
  "Upper West", "Volta", "Oti", "Western", "Western North"
];

const categories = [
  "All", "Vegetables", "Fruits", "Grains", "Tubers", "Spices"
];

export function FilterSidebar() {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Filter Produce</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="crop-type">Crop Type</Label>
          <Input id="crop-type" placeholder="e.g. Tomato, Mango..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
