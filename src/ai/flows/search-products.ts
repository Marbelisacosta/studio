'use server';
/**
 * @fileOverview Product search AI agent.
 *
 * - searchProducts - A function that handles the product search process.
 * - SearchProductsInput - The input type for the searchProducts function.
 * - SearchProductsOutput - The return type for the searchProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchProductsInputSchema = z.object({
  query: z.string().describe('The search query provided by the user.'),
});
export type SearchProductsInput = z.infer<typeof SearchProductsInputSchema>;

const SearchProductsOutputSchema = z.object({
  products: z
    .array(z.string())
    .describe('A list of product names that match the search query.'),
});
export type SearchProductsOutput = z.infer<typeof SearchProductsOutputSchema>;

export async function searchProducts(input: SearchProductsInput): Promise<SearchProductsOutput> {
  return searchProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchProductsPrompt',
  input: {schema: SearchProductsInputSchema},
  output: {schema: SearchProductsOutputSchema},
  prompt: `You are a product search assistant for an online store.

  Based on the user's query, provide a list of product names that match the query.

  Query: {{{query}}}
  `,
});

const searchProductsFlow = ai.defineFlow(
  {
    name: 'searchProductsFlow',
    inputSchema: SearchProductsInputSchema,
    outputSchema: SearchProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
