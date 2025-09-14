import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as uploadModule from '@/infra/storage/upload-file-to-storage'
import { seedUrls } from '@/testes/utils/urls-fixtures'
import { exportUrlsCsv } from './export-urls-csv'

describe('exportUrlsCsv', () => {
  beforeEach(async () => {
    await db.delete(schema.urls)
  })

  it('should export urls to csv and return the csv url', async () => {
    const uploadStub = vi
      .spyOn(uploadModule, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: `https://deathstar.com/troopers.csv`,
        }
      })

    const _urls = await seedUrls(7)
    const sut = await exportUrlsCsv()

    console.log(sut)

    expect(isRight(sut)).toBeTruthy()

    expect(uploadStub).toHaveBeenCalled()
    expect(unwrapEither(sut)).toEqual({
      exportedCsvUrl: expect.stringContaining(
        'https://deathstar.com/troopers.csv'
      ),
    })
  })
})
