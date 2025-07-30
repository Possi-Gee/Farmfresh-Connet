import { ListingForm } from "@/components/forms/ListingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Create a New Listing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Fill out the form below to list your produce.</CardDescription>
        </CardHeader>
        <CardContent>
          <ListingForm />
        </CardContent>
      </Card>
    </div>
  );
}
