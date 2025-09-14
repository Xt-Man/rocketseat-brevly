import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { exportUrlsCsv } from '@/app/functions/export-urls-csv'
import { isLeft, unwrapEither } from '@/infra/shared/either'

export const exportUrlsCsvRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/urls/csv',
    {
      schema: {
        summary: 'Export all shortened urls in CSV format',
        response: {
          200: z.object({
            exportedCsvUrl: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_request, reply) => {
      const result = await exportUrlsCsv()

      if (isLeft(result))
        return reply.status(400).send({ message: 'Error exporting CSV' })

      const { exportedCsvUrl } = unwrapEither(result)

      return reply.status(200).send({ exportedCsvUrl })
    }
  )
} // final do arquivo
