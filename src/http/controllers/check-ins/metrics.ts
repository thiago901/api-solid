import { makeMetricsCheckInUseCase } from '@/use-cases/factories/make-metrics-check-in-use-case'

import { FastifyRequest, FastifyReply } from 'fastify'

export async function metricsCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchGymsUseCase = makeMetricsCheckInUseCase()
  const { checkInsCount } = await searchGymsUseCase.execute({
    user_id: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
