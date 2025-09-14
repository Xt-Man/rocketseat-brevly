import { desc } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import type { urlInterface } from './interface/url'

export async function listShortUrls(): Promise<Either<never, urlInterface[]>> {
  const result = await db
    .select()
    .from(schema.urls)
    .orderBy(desc(schema.urls.createdAt))

  return makeRight(
    result.map(item => {
      return {
        id: item.id,
        originalUrl: item.originalUrl,
        accessCount: item.accessCount,
        createdAt: item.createdAt,
        shortenedUrl: item.shortenedUrl,
      }
    })
  )
}
