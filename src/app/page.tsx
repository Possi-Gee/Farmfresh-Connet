import { ProductCard } from "@/components/ProductCard";
import { FilterSidebar } from "@/components/FilterSidebar";

// Mock data for produce listings
const produce = [
  {
    id: "1",
    name: "Organic Tomatoes",
    category: "Vegetables",
    price: 3.99,
    unit: "kg",
    quantity: 50,
    location: "Kumasi, Ashanti",
    imageUrl: "https://placehold.co/600x400.png",
    farmer: "Afia Bio Farms",
    hint: "tomatoes vegetable",
  },
  {
    id: "2",
    name: "Fresh Mangoes",
    category: "Fruits",
    price: 5.00,
    unit: "crate",
    quantity: 100,
    location: "Sunyani, Bono",
    imageUrl: "https://placehold.co/600x400.png",
    farmer: "Bono Tropical Fruits",
    hint: "mangoes fruit",
  },
  {
    id: "3",
    name: "Sweet Corn",
    category: "Grains",
    price: 2.50,
    unit: "cob",
    quantity: 200,
    location: "Techiman, Bono East",
    imageUrl: "https://placehold.co/600x400.png",
    farmer: "Golden Corn Fields",
    hint: "corn grain",
  },
  {
    id: "4",
    name: "Yams",
    category: "Tubers",
    price: 10.00,
    unit: "tuber",
    quantity: 150,
    location: "Tamale, Northern",
    imageUrl: "https://placehold.co/600x400.png",
    farmer: "Northern Star Tubers",
    hint: "yams tubers",
  },
  {
    id: "5",
    name: "Habanero Peppers",
    category: "Vegetables",
    price: 8.50,
    unit: "kg",
    quantity: 30,
    location: "Cape Coast, Central",
    imageUrl: "https://placehold.co/600x400.png",
    farmer: "Coastal Spice Co.",
    hint: "pepper spicy",
  },
  {
    id: "6",
    name: "Juicy Pineapples",
    category: "Fruits",
    price: 4.00,
    unit: "each",
    quantity: 80,
    location: "Ho, Volta",
    imageUrl: "https://placehold.co/600x400.png",
    farmer: "Volta Sweet Pineapples",
    hint: "pineapple fruit",
  },
];

export type Produce = (typeof produce)[0];

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <FilterSidebar />
        </div>
        <div className="col-span-1 md:col-span-3">
          <h1 className="text-3xl font-headline font-bold mb-6">Fresh Produce</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produce.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
