import z from 'zod/v4'

export const createShortUrlDto = z.object({
  originalUrl: z.url(),
  shortenedUrl: z
    .string()
    .max(255)
    .regex(/^[a-zA-Z0-9_-]+$/),
})
