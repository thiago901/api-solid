import { UserCredentialsInvalid } from '@/use-cases/errors/user-credentials-invalid-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)
  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )
    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )
    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token })
  } catch (error: any) {
    if (error instanceof UserCredentialsInvalid) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
