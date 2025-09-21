import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { createShortUrlRoute } from './routes/create-short-url'
import { deleteShortUrlByIdRoute } from './routes/delete-short-url-by-id'
import { exportUrlsCsvRoute } from './routes/export-urls-csv'
import { getOriginalUrlByShortRoute } from './routes/get-original-url-by-short'
import { helloRoute } from './routes/hello'
import { listShortUrlsRoute } from './routes/list-short-urls'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    console.log(error.validation)
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  // Envia o erro p/ alguma ferramentea de observabilidade

  console.error(error)

  return reply.status(500).send({ maesage: 'Internal server error.' })
})

server.register(fastifyCors, { origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'] 
 })
server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'brev.ly',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// registrar as rotas
server.register(helloRoute)
server.register(createShortUrlRoute)
server.register(deleteShortUrlByIdRoute)
server.register(getOriginalUrlByShortRoute)
server.register(listShortUrlsRoute)
server.register(exportUrlsCsvRoute)

console.log(env.DATABASE_URL)

server
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running!')
  })
