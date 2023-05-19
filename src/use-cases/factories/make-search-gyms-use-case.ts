import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGyms } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const searchGymsteUseCase = new SearchGyms(prismaGymRepository)
  return searchGymsteUseCase
}
