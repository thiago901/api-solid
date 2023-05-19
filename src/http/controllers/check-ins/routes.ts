import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { createCheckInController } from './create'

import { validateCheckInController } from './validate'
import { historyCheckInController } from './history'
import { metricsCheckInController } from './metrics'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', createCheckInController)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: verifyUserRole('ADMIN') },
    validateCheckInController,
  )

  app.get('/check-ins/history', historyCheckInController)
  app.get('/check-ins/metrics', metricsCheckInController)
}
