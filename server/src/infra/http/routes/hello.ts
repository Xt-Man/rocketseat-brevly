import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const helloRoute: FastifyPluginAsyncZod = async server => {
  server.get('/hello', () => {
    return 'Hello World'
  })
}
