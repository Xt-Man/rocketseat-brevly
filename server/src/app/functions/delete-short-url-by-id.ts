import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { NotFoundShortUrlError } from './erros/not-found-short-url'

export async function deleteShortUrlById(
  id: string
): Promise<Either<NotFoundShortUrlError, null>> {
  const result = await db
    .delete(schema.urls)
    .where(eq(schema.urls.id, id))
    .returning()

  if (result.length === 0) return makeLeft(new NotFoundShortUrlError())

  return makeRight(null)
}
