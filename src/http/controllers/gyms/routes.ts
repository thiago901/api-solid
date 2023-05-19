import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { createGymController } from './create'
import { searchGymController } from './search'
import { nearbyGymController } from './nearby'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/gyms', { onRequest: verifyUserRole('ADMIN') }, createGymController)
  app.get('/gyms/search', searchGymController)
  app.get('/gyms/nearby', nearbyGymController)
}
