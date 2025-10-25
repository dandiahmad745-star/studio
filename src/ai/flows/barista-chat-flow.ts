'use server';
/**
 * @fileOverview A barista chat AI agent.
 *
 * This file defines a Genkit flow that allows a user to chat with an AI
 * role-playing as a specific coffee shop barista.
 *
 * - baristaChat - The main function that takes barista persona, chat history,
 *   and a new message to generate a contextual AI response.
 * - BaristaChatInput - The Zod schema for the flow's input.
 * - BaristaChatHistory - The Zod schema for a single chat message.
 */

import { ai } from '@/ai/genkit';
import { Barista } from '@/lib/types';
import { z } from 'zod';

// Define the schema for chat history messages
export const BaristaChatHistorySchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type BaristaChatHistory = z.infer<typeof BaristaChatHistorySchema>;

// Define the input schema for the Genkit flow
export const BaristaChatInputSchema = z.object({
  barista: z.object({
    name: z.string(),
    bio: z.string(),
    favoriteDrink: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }),
  chatHistory: z.array(BaristaChatHistorySchema).describe("The history of the conversation so far."),
  question: z.string().describe('The newest question from the user.'),
});
export type BaristaChatInput = z.infer<typeof BaristaChatInputSchema>;


/**
 * Generates a response from an AI role-playing as a coffee shop barista.
 * @param barista The barista persona to adopt.
 * @param history The previous chat messages.
 * @param question The new question from the user.
 * @returns A promise that resolves to the AI's string response.
 */
export async function baristaChat(
    barista: Barista,
    history: BaristaChatHistory[],
    question: string,
): Promise<string> {
    const input: BaristaChatInput = {
        barista: {
            name: barista.name,
            bio: barista.bio,
            favoriteDrink: barista.favoriteDrink,
            skills: barista.skills,
        },
        chatHistory: history,
        question,
    };
    const response = await baristaChatFlow(input);
    return response;
}

// Define the main prompt for the AI
const baristaChatPrompt = ai.definePrompt({
    name: 'baristaChatPrompt',
    input: { schema: BaristaChatInputSchema },

    // The system prompt sets the AI's persona and rules
    system: `You are a friendly and knowledgeable coffee shop barista named {{barista.name}}.
Your personality and background: {{barista.bio}}
{{#if barista.favoriteDrink}}Your favorite drink to make and recommend is {{barista.favoriteDrink}}.{{/if}}
{{#if barista.skills}}You have the following skills: {{#each barista.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.{{/if}}

Your role is to chat with customers in a friendly, casual, and helpful way.
- ALWAYS respond in Bahasa Indonesia.
- Keep your responses concise and conversational, like you're talking to someone in a real cafe. Aim for 2-3 sentences.
- Use your persona details to answer questions. If a customer asks about your favorite drink or skills, use the information provided.
- Be helpful and answer questions about coffee, the cafe, or just have a friendly chat.
- Do not break character. You are not an AI, you are {{barista.name}}.`,

    // The prompt template structures the conversation history and the new question
    prompt: `{{#each chatHistory}}
{{#if (eq role 'user')}}User: {{content}}\n{{/if}}
{{#if (eq role 'assistant')}}You: {{content}}\n{{/if}}
{{/each}}
User: {{question}}
You:`,
});


// Define the Genkit flow
const baristaChatFlow = ai.defineFlow(
  {
    name: 'baristaChatFlow',
    inputSchema: BaristaChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Generate a response using the prompt and the provided input
    const { output } = await baristaChatPrompt(input, {
        // Specify the model to use. Gemini 2.5 Flash is a good choice for fast chat.
        model: 'googleai/gemini-2.5-flash',
        config: {
            // Set a low temperature for more predictable, less "creative" responses
            // to keep the AI in character.
            temperature: 0.3,
        }
    });
    
    // The output will be a string, as defined by the prompt's handlebars and output schema.
    return output!;
  }
);
