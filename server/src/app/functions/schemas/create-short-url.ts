import z from 'zod/v4'
import { SHORTENED_URL_REGEX } from '@/constants'

export const createShortUrlSchema = z.object({
  originalUrl: z.url(),
  shortenedUrl: z.string().max(255).regex(SHORTENED_URL_REGEX),
})
