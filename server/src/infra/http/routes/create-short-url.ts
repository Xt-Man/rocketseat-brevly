import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { createShortUrl } from '@/app/functions/create-short-url'
import { isDuplicatedShortUrlError } from '@/app/functions/erros/duplicated-short-url'
import { createShortUrlSchema } from '@/app/functions/schemas/create-short-url'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const createShortUrlRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/urls',
    {
      schema: {
        summary: 'Create a shortened URL',
        body: createShortUrlSchema,
        response: {
          201: z.object({
            id: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortenedUrl: shortened } = request.body

      const result = await createShortUrl({
        originalUrl,
        shortenedUrl: shortened,
      })

      if (isRight(result)) return reply.status(201).send(unwrapEither(result))

      const error = unwrapEither(result)

      if (isDuplicatedShortUrlError(error))
        return reply
          .status(400)
          .send({ message: 'Shortened url already exists' })
    }
  )
}
