import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { listShortUrls } from '@/app/functions/list-short-urls'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const listShortUrlsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/urls',
    {
      schema: {
        summary: 'Get all shortened urls',
        response: {
          200: z.array(
            z.object({
              originalUrl: z.url(),
              shortenedUrl: z.string(),
              accessCount: z.number(),
              createdAt: z.date(),
              id: z.string(),
            })
          ),
        },
      },
    },
    async (_request, reply) => {
      const result = await listShortUrls()

      if (isRight(result)) return reply.status(200).send(unwrapEither(result))
    }
  )
}
