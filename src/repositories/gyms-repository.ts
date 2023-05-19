import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyGymsParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  findOneById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(data: FindManyNearbyGymsParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
