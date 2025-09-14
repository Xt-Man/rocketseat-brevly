import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/infra/shared/either'
import { seedUrls } from '@/testes/utils/urls-fixtures'
import { deleteShortUrlById } from './delete-short-url-by-id'

describe('deleteShortUrl', () => {
  beforeEach(async () => {
    await db.delete(schema.urls)
  })

  it('should not be able to delete an inexistent shortened url', async () => {
    const sut = await deleteShortUrlById('not-found-id')
    expect(isLeft(sut)).toBeTruthy()
  })

  it('should be able to delete an existent shortened url', async () => {
    const urls = await seedUrls(1)

    const sut = await deleteShortUrlById(urls[0].id)

    expect(isRight(sut)).toBeTruthy()

    const result = await db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.id, urls[0].id))

    expect(result).toHaveLength(0)
  })
})
