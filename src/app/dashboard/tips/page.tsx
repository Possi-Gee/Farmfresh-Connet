import { FarmingTipsForm } from "@/components/forms/FarmingTipsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function FarmingTipsPage() {
  return (
    <div className="container mx-auto py-8 md:py-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary/20 p-3 rounded-lg">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline">AI Farming Tips</h1>
            <p className="text-muted-foreground">Get personalized advice for your crops.</p>
          </div>
        </div>
        
        <FarmingTipsForm />
      </div>
    </div>
  );
}
