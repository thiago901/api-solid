import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGyms } from '../fetch-nearby-gyms'

export function makeNearbyGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const fetchNearbyGyms = new FetchNearbyGyms(prismaGymRepository)
  return fetchNearbyGyms
}
