import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export const createShortUrlRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/urls',
    {
      schema: {
        summary: 'Create a shortened URL',
        body: z.object({
          originalUrl: z.url(),
          shortened: z
            .string()
            .max(255)
            .regex(/^[a-zA-Z0-9_-]+$/),
        }),
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
      const { originalUrl, shortened } = request.body

      const _result = await db.insert(schema.urls).values({
        originalUrl,
        shortenedUrl: shortened,
      })

      return reply.status(201).send({
        id: 'pegar o id',
      })
    }
  )
}
