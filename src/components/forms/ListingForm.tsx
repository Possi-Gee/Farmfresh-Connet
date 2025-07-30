"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


const categories = ["Vegetables", "Fruits", "Grains", "Tubers", "Spices", "Other"];

const formSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string({ required_error: "Please select a category." }),
  price: z.coerce.number().positive("Price must be a positive number."),
  quantity: z.coerce.number().int().positive("Quantity must be a positive number."),
  unit: z.string().min(1, "Please specify a unit (e.g., kg, crate, bunch)."),
  location: z.string().min(3, "Please enter a location."),
  imageType: z.enum(["upload", "url"]).default("upload"),
  imageUrl: z.string().url("Please provide a valid URL.").optional().or(z.literal('')),
  imageFile: z.any().optional(),
}).refine(data => {
    if (data.imageType === 'url') {
        return !!data.imageUrl;
    }
    if (data.imageType === 'upload') {
        return data.imageFile?.length > 0;
    }
    return false;
}, {
    message: "Please provide an image URL or upload a file.",
    path: ["imageType"],
});

export function ListingForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      description: "",
      price: 0,
      quantity: 1,
      unit: "kg",
      location: "",
      imageType: "upload",
      imageUrl: "",
    },
  });

  const imageType = form.watch("imageType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to create a listing.", variant: "destructive" });
        return;
    }
    setLoading(true);

    try {
        let imageUrl = values.imageUrl || '';
        
        if (values.imageType === 'upload' && values.imageFile?.length > 0) {
            const file = values.imageFile[0];
            const storage = getStorage();
            const storageRef = ref(storage, `listings/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "listings"), {
            farmerId: user.uid,
            farmerName: user.displayName,
            productName: values.productName,
            description: values.description,
            category: values.category,
            price: values.price,
            quantity: values.quantity,
            unit: values.unit,
            location: values.location,
            imageUrl: imageUrl,
            createdAt: serverTimestamp(),
            status: "Active",
        });

        toast({ title: "Success!", description: "Your listing has been created." });
        router.push("/dashboard/listings");

    } catch (error) {
        console.error("Error creating listing:", error);
        toast({ title: "Error", description: "Failed to create listing. Please try again.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Organic Tomatoes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your product..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (GH₵)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="kg, crate, item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Kumasi, Ashanti" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageType"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                    <Tabs
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as "url" | "upload")}
                    >
                        <TabsList>
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                            <TabsTrigger value="url">URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="mt-4">
                            <FormField
                                control={form.control}
                                name="imageFile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="file" {...form.register("imageFile")} />
                                        </FormControl>
                                        <FormDescription>Upload an image of your product.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                        <TabsContent value="url" className="mt-4">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.png" {...field} />
                                        </FormControl>
                                        <FormDescription>Enter the URL of the product image.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Listing
        </Button>
      </form>
    </Form>
  );
}
