import { makeCreateCheckInUseCase } from '@/use-cases/factories/make-create-check-in-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function createCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const checkInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const checkInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { latitude, longitude } = checkInBodySchema.parse(request.body)
  const { gymId } = checkInParamsSchema.parse(request.params)

  const checkListUseCase = makeCreateCheckInUseCase()
  await checkListUseCase.execute({
    gym_id: gymId,
    user_id: request.user.sub,
    user_latitude: latitude,
    user_longitude: longitude,
  })

  return reply.status(201).send()
}
