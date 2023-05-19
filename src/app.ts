import fastifyJWT from '@fastify/jwt'
import cookie from '@fastify/cookie'
import fastify from 'fastify'

import { ZodError } from 'zod'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()
app.register(cookie)
app.register(fastifyJWT, {
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10min',
  },
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Implementar uma ferramenta externa como datadog/sentry/newrelic
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
