import { makeNearbyGymsUseCase } from '@/use-cases/factories/make-nearby-gyms-use-case'

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function nearbyGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const nearbyGymQuery = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymQuery.parse(request.query)

  const nearbyGymUseCase = makeNearbyGymsUseCase()
  const { gyms } = await nearbyGymUseCase.execute({
    user_latitude: latitude,
    user_longitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
