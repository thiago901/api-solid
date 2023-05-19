import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function createGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const gymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { description, latitude, longitude, phone, title } =
    gymBodySchema.parse(request.body)

  const gymUseCase = makeCreateGymUseCase()
  await gymUseCase.execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  })

  return reply.status(201).send()
}
