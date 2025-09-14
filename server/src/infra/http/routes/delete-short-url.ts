import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { deleteShortUrl } from '@/app/functions/delete-short-url'
import { isNotFoundShortUrlError } from '@/app/functions/erros/not-found-short-url'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const deleteShortUrlRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/urls/:id',
    {
      schema: {
        summary: 'Delete an url by id',
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await deleteShortUrl(id)

      if (isRight(result)) return reply.status(204).send()

      const error = unwrapEither(result)

      if (isNotFoundShortUrlError(error))
        return reply.status(404).send({ message: error.message })
    }
  )
}
