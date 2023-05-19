import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUseCase } from '../check-in'

export function makeCreateCheckInUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const checkInUseCase = new CheckInUseCase(
    prismaCheckInsRepository,
    prismaGymRepository,
  )
  return checkInUseCase
}
