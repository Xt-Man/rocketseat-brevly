import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { InvalidFileFormat } from './erros/invalid-file-format'
import { uploadCsv } from './upload-csv'

describe('upload csv', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.csv`,
            url: 'https://deathstar.com/troopers.csv',
          }
        }),
      }
    })
  })

  it('should be able to upload an csv file', async () => {
    const fileName = `${randomUUID()}.jpg`

    const sut = await uploadCsv({
      fileName,
      contentType: 'text/csv',
      contentStream: Readable.from([]),
    })

    expect(isRight(sut)).toBe(true)
  })

  it('should not be able to upload an invalid file', async () => {
    const fileName = `${randomUUID()}.pdf`

    const sut = await uploadCsv({
      fileName,
      contentType: 'document/pdf',
      contentStream: Readable.from([]),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat)
  })
})
