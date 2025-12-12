import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { subscribeUser } from '../services/subscription';

export const server = {
  subscribe: defineAction({
    accept: 'json',
    input: z.object({
      email: z.string().email(),
      name: z.string().optional(),
      phone: z.string().optional(),
      subjectCodes: z.array(z.string())
    }),
    handler: async (input) => {
      try {
        const user = await subscribeUser(input);
        return { success: true, user };
      } catch (error: any) {
        // Return error structure handled by Astro Actions
        // Usually throws ActionError
        console.error(error);
        throw new Error(error.message || "Internal Server Error");
      }
    }
  })
};
