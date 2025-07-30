
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const regions = [
  "all", "Ashanti", "Bono", "Bono East", "Ahafo", "Central", "Eastern",
  "Greater Accra", "Northern", "Savannah", "North East", "Upper East",
  "Upper West", "Volta", "Oti", "Western", "Western North"
];

const categories = [
  "All", "Vegetables", "Fruits", "Grains", "Tubers", "Spices", "Other"
];

interface FilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
}

export function FilterSidebar({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  region,
  setRegion
}: FilterSidebarProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Filter Produce</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="crop-type">Search by Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="crop-type" 
              placeholder="e.g. Tomato, Mango..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((reg) => (
                <SelectItem key={reg} value={reg}>{reg === 'all' ? 'All Regions' : reg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
