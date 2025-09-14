import { Readable } from 'node:stream'
import z from 'zod/v4'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { InvalidFileFormat } from './erros/invalid-file-format'

const uploadCsvInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadCsvInput = z.input<typeof uploadCsvInput>

const allowedMimeTypes = ['text/csv']

export async function uploadCsv(
  input: UploadCsvInput
): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { contentStream, contentType, fileName } = uploadCsvInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat())
  }

  const { url } = await uploadFileToStorage({
    folder: 'exports',
    fileName,
    contentType,
    contentStream,
  })

  return makeRight({ url })
}
