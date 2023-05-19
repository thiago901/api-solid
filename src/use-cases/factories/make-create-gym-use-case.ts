import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GymUseCase } from '../gym'

export function makeCreateGymUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const gymUseCase = new GymUseCase(prismaGymRepository)

  return gymUseCase
}
