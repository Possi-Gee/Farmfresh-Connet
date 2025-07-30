"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateFarmingTips, GenerateFarmingTipsInput, GenerateFarmingTipsOutput } from "@/ai/flows/generate-farming-tips";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  cropType: z.string().min(2, { message: "Please enter a crop type." }),
  growthStage: z.string().min(2, { message: "Please enter a growth stage." }),
  region: z.string().min(2, { message: "Please enter your region." }),
});

export function FarmingTipsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateFarmingTipsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      growthStage: "",
      region: "",
    },
  });

  async function onSubmit(values: GenerateFarmingTipsInput) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const tipsResult = await generateFarmingTips(values);
      setResult(tipsResult);
    } catch (e) {
      setError("An error occurred while generating tips. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Crop Details</CardTitle>
          <CardDescription>Fill in the details below to get your customized farming advice.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Corn, Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="growthStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Growth Stage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Seedling, Flowering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region/Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kumasi, Ashanti" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Tips
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-6 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Wand2 className="text-primary"/> Your Personalized Farming Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {result.tips}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
