
"use client";

import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    phoneNumber: z.string().min(10, "Please enter a valid phone number."),
    accountType: z.enum(["farmer", "buyer"], { required_error: "Please select an account type." }),
});

export default function CompleteProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...values,
                email: user.email,
                fullName: user.displayName,
            }, { merge: true });

            toast({ title: "Profile Complete!", description: "Welcome to FarmFresh Connect!" });
            
            // Force a reload of the auth state to get the new accountType
            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Error completing profile:", error);
            toast({ title: "Error", description: "Could not update your profile. Please try again.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Complete Your Profile</CardTitle>
                    <CardDescription>Just one more step to get you started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="024xxxxxxx" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountType"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>I am a...</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                        >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="farmer" />
                                            </FormControl>
                                            <Label className="font-normal">Farmer</Label>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="buyer" />
                                            </FormControl>
                                            <Label className="font-normal">Buyer</Label>
                                        </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save and Continue
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
