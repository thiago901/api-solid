import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegiterUseCase } from '../register'

export function makeRegisterUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const regiterUseCase = new RegiterUseCase(prismaUserRepository)
  return regiterUseCase
}
