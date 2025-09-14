import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { createShortUrl } from './create-short-url'
import { DuplicatedShortUrlError } from './erros/duplicated-short-url'

describe('createShortUrl', () => {
  beforeEach(async () => {
    await db.delete(schema.urls)
  })

  const originalUrl = 'https://www.typescriptlang.org/'
  const shortenedUrl = 'short-ts'

  it('should create a shortened url', async () => {
    // sut - system under test
    const sut = await createShortUrl({
      originalUrl,
      shortenedUrl,
    })

    expect(isRight(sut)).toBeTruthy()

    const result = await db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.shortenedUrl, shortenedUrl))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create a duplicated shortened url', async () => {
    await createShortUrl({
      originalUrl,
      shortenedUrl,
    })
    const sut = await createShortUrl({
      originalUrl,
      shortenedUrl,
    })

    expect(isLeft(sut)).toBeTruthy
    expect(unwrapEither(sut)).toBeInstanceOf(DuplicatedShortUrlError)
  })
})
