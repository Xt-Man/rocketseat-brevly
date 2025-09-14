import { eq, sql } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { NotFoundShortUrlError } from './erros/not-found-short-url'

export async function incrementAccessCountById(
  id: string
): Promise<Either<NotFoundShortUrlError, null>> {
  const result = await db
    .update(schema.urls)
    .set({
      accessCount: sql`${schema.urls.accessCount} + 1`,
    })
    .where(eq(schema.urls.id, id))
    .returning()

  if (result.length === 0) return makeLeft(new NotFoundShortUrlError())

  return makeRight(null)
}
