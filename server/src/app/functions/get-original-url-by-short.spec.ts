import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { seedUrls } from '@/testes/utils/urls-fixtures'
import { NotFoundShortUrlError } from './erros/not-found-short-url'
import { getOriginalUrlByShort } from './get-original-url-by-short'

describe('getOriginalLinkBySlug', () => {
  beforeEach(async () => {
    await db.delete(schema.urls)
  })

  it('should return the original Url', async () => {
    const urls = await seedUrls()

    const sut = await getOriginalUrlByShort({
      shortenedUrl: urls[0].shortenedUrl,
    })

    expect(isRight(sut)).toBeTruthy
    expect(unwrapEither(sut)).toEqual({
      originalUrl: urls[0].originalUrl,
    })
  })

  it('should return an error if the shortened url is not found', async () => {
    const sut = await getOriginalUrlByShort({
      shortenedUrl: 'non-existent-shortened-url',
    })

    expect(isLeft(sut)).toBeTruthy
    expect(unwrapEither(sut)).toEqual(new NotFoundShortUrlError())
  })
})
