import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { seedUrls } from '@/testes/utils/urls-fixtures'
import { listShortUrls } from './list-short-urls'

describe('listShortUrls', () => {
  beforeEach(async () => {
    await db.delete(schema.urls)
  })

  it('should return all urls', async () => {
    const urls = await seedUrls(2)

    const sut = await listShortUrls()

    expect(isRight(sut)).toBeTruthy()

    // ordene urls by createdAt desc
    urls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    expect(unwrapEither(sut)).toEqual(urls)
  })
})
