import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().min(1),
  UPSTASH_REDIS_URL: z.string().url(),
  UPSTASH_REDIS_TOKEN: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
});

function validateEnv() {
  try {
    const parsed = envSchema.parse({
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
      UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
      MONGODB_URI: process.env.MONGODB_URI,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    });
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.'));
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }
    throw error;
  }
}

export const env = validateEnv();