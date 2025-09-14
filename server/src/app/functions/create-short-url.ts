import type z from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { DuplicatedShortUrlError } from './erros/duplicated-short-url'
import { createShortUrlSchema } from './schemas/create-short-url'

type CreateShortUrlInput = z.infer<typeof createShortUrlSchema>

export async function createShortUrl(
  input: CreateShortUrlInput
): Promise<Either<DuplicatedShortUrlError, { id: string }>> {
  const { originalUrl, shortenedUrl: shortened } =
    createShortUrlSchema.parse(input)

  const result = await db
    .insert(schema.urls)
    .values({
      originalUrl,
      shortenedUrl: shortened,
    })
    .returning({ id: schema.urls.id })
    .onConflictDoNothing({ target: schema.urls.shortenedUrl })

  if (result.length === 0) return makeLeft(new DuplicatedShortUrlError())

  return makeRight({ id: result[0].id })
}
