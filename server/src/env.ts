import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(8080),
  ORIGIN: z.string().default('http://localhost:5173'),
  PUBLIC_URL: z.string().default('http://localhost:8080'),
  TELEGRAM_BOT_TOKEN: z.string().min(10),
  TELEGRAM_WEBAPP_URL: z.string().default('http://localhost:5173'),
  TELEGRAM_WEBHOOK_SECRET: z.string().default(''),
  TELEGRAM_WEBHOOK_URL: z.string().optional(),
  UPLOAD_DIR: z.string().default('./uploads'),
  GENERATED_DIR: z.string().default('./generated'),
  PAYMENTS_PROVIDER: z.enum(['mock']).default('mock'),
  PROVIDER_TOKEN: z.string().optional()
});

export const env = schema.parse(process.env);
