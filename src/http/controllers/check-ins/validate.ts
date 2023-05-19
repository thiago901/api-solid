import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function validateCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()
  await validateCheckInUseCase.execute({
    check_in_id: checkInId,
  })

  return reply.status(204).send()
}
