import { z } from 'zod';

const environment = z.object({
  DATABASE_URL: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_SECRET: z.string(),
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  NEXTAUTH_SECRET: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof environment> {}
  }
}
