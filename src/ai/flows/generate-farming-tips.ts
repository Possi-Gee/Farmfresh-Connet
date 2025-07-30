// src/ai/flows/generate-farming-tips.ts
'use server';

/**
 * @fileOverview Flow for generating localized farming tips using AI.
 *
 * - generateFarmingTips - A function that generates farming tips based on crop type, growth stage, and region.
 * - GenerateFarmingTipsInput - The input type for the generateFarmingTips function.
 * - GenerateFarmingTipsOutput - The return type for the generateFarmingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFarmingTipsInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., corn, soybeans, tomatoes).'),
  growthStage: z
    .string()
    .describe(
      'The current growth stage of the crop (e.g., seedling, flowering, fruiting).'
    ),
  region: z.string().describe('The geographic region where the farm is located.'),
});
export type GenerateFarmingTipsInput = z.infer<typeof GenerateFarmingTipsInputSchema>;

const GenerateFarmingTipsOutputSchema = z.object({
  tips: z.string().describe('AI-generated farming tips tailored to the input parameters.'),
});
export type GenerateFarmingTipsOutput = z.infer<typeof GenerateFarmingTipsOutputSchema>;

export async function generateFarmingTips(
  input: GenerateFarmingTipsInput
): Promise<GenerateFarmingTipsOutput> {
  return generateFarmingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFarmingTipsPrompt',
  input: {schema: GenerateFarmingTipsInputSchema},
  output: {schema: GenerateFarmingTipsOutputSchema},
  prompt: `You are an expert agricultural advisor providing localized farming tips.

  Based on the following information, provide specific and actionable tips to improve farming practices and yields.

  Crop Type: {{{cropType}}}
  Growth Stage: {{{growthStage}}}
  Region: {{{region}}}

  Tips:`,
});

const generateFarmingTipsFlow = ai.defineFlow(
  {
    name: 'generateFarmingTipsFlow',
    inputSchema: GenerateFarmingTipsInputSchema,
    outputSchema: GenerateFarmingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
