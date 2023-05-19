import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { GetUserMetricsCase } from '../get-user-metrics'

export function makeMetricsCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsCase = new GetUserMetricsCase(prismaCheckInsRepository)
  return getUserMetricsCase
}
