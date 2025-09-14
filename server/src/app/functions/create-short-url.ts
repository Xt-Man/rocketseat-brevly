import type z from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { createShortUrlDto } from './dtos/create-short-url'
import { DuplicatedShortUrlError } from './erros/duplicated-short-url'

type ShortUrlInput = z.infer<typeof createShortUrlDto>

export async function createShortUrl(
  input: ShortUrlInput
): Promise<Either<DuplicatedShortUrlError, { id: string }>> {
  const { originalUrl, shortenedUrl: shortened } =
    createShortUrlDto.parse(input)

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
