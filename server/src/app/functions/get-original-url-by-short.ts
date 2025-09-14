import { eq } from 'drizzle-orm'
import type { z } from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { NotFoundShortUrlError } from './erros/not-found-short-url'
import { shortenedUrlSchema } from './schemas/shortened-url'

type GetOriginalUrlByShortInput = z.infer<typeof shortenedUrlSchema>

export async function getOriginalUrlByShort(
  input: GetOriginalUrlByShortInput
): Promise<Either<NotFoundShortUrlError, { originalUrl: string }>> {
  const { shortenedUrl } = shortenedUrlSchema.parse(input)

  const result = await db
    .select()
    .from(schema.urls)
    .where(eq(schema.urls.shortenedUrl, shortenedUrl))

  if (result.length === 0) return makeLeft(new NotFoundShortUrlError())

  const url = result[0]

  // incrementar contador de acessos ?

  return makeRight({ originalUrl: url.originalUrl })
}
