import { makeHistoryCheckInUseCase } from '@/use-cases/factories/make-history-check-in-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function historyCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const historyCheckInQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = historyCheckInQuerySchema.parse(request.query)

  const historyCheckInUseCase = makeHistoryCheckInUseCase()
  const { checkIns } = await historyCheckInUseCase.execute({
    page,
    user_id: request.user.sub,
  })

  return reply.status(200).send({
    checkIns,
  })
}
