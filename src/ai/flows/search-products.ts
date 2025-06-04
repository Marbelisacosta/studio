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
  prompt: `Eres un asistente de búsqueda de productos para una tienda en línea. Tu objetivo es ayudar al usuario a encontrar productos en nuestro catálogo.
Basado en la consulta del usuario, proporciona una lista de nombres de productos en español que coincidan con la consulta.
Si la consulta del usuario parece ser un nombre de producto específico, asegúrate de incluir ese nombre exacto en tu lista de resultados.
Intenta también incluir variaciones comunes de capitalización si es relevante.
Por ejemplo, si el usuario busca "zapato azul", podrías sugerir ["zapato azul", "Zapato Azul"].
Si el usuario busca "Mi Super Producto", sugiere ["Mi Super Producto"].

Consulta: {{{query}}}
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
    let productsFromAI = output?.products || [];

    // Asegurar que la consulta original y sus variaciones de capitalización comunes se busquen:
    const queryVariations = new Set<string>(productsFromAI);
    if (input.query && input.query.trim() !== '') {
      queryVariations.add(input.query); // Original
      queryVariations.add(input.query.toLowerCase()); // minúsculas
      queryVariations.add(input.query.toUpperCase()); // MAYÚSCULAS
      queryVariations.add(
        input.query
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ); // Tipo Título
    }
    
    return { products: Array.from(queryVariations).filter(p => p.trim() !== '') };
  }
);
