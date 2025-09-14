import { stringify } from 'csv-stringify'
import {
  type Either,
  isLeft,
  makeRight,
  unwrapEither,
} from '@/infra/shared/either'
import { listShortUrls } from './list-short-urls'
import { uploadCsv } from './upload-csv'

export async function exportUrlsCsv(): Promise<
  Either<never, { exportedCsvUrl: string }>
> {
  const urls = await listShortUrls()

  if (isLeft(urls)) throw new Error('Erro ao listar urls')

  const urlsArray = unwrapEither(urls)

  // gerar csv
  const fileName = `export-${new Date().toISOString()}.csv`

  const columns = [
    'id',
    'originalUrl',
    'shortenedUrl',
    'accessCount',
    'createdAt',
  ]

  const stringifier = stringify({
    delimiter: ',',
    header: true,
    columns: columns,
  })

  urlsArray.forEach(url => {
    stringifier.write([
      url.id,
      url.originalUrl,
      url.shortenedUrl,
      url.accessCount,
      url.createdAt.toISOString(),
    ])
  })
  stringifier.end()

  // subir para cdn (amazon s3, cloudflare r2, etc)
  const result = await uploadCsv({
    fileName,
    contentType: 'text/csv',
    contentStream: stringifier,
  })

  if (isLeft(result)) throw new Error('Erro ao fazer upload do csv')

  const { url: exportedCsvUrl } = unwrapEither(result)

  // retornar url do csv
  return makeRight({ exportedCsvUrl })
}
