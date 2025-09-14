import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { isNotFoundShortUrlError } from '@/app/functions/erros/not-found-short-url'
import { getOriginalUrlByShort } from '@/app/functions/get-original-url-by-short'
import { shortenedUrlSchema } from '@/app/functions/schemas/shortened-url'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const getOriginalUrlByShortRoute: FastifyPluginAsyncZod =
  async server => {
    server.get(
      '/urls/:shortenedUrl',
      {
        schema: {
          summary: 'Get original url by his shortened',
          params: shortenedUrlSchema,
          response: {
            200: z.object({
              originalUrl: z.url(),
            }),
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { shortenedUrl } = request.params

        const result = await getOriginalUrlByShort({ shortenedUrl })

        if (isRight(result)) return reply.status(200).send(unwrapEither(result))

        const error = unwrapEither(result)

        if (isNotFoundShortUrlError(error))
          return reply.status(404).send({ message: error.message })
      }
    )
  }
