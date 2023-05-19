import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'

import { AuthenticateUserCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUserCase(prismaUserRepository)
  return authenticateUseCase
}
