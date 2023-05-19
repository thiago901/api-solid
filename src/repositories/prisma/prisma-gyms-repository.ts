import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyGymsParams, GymsRepository } from '../gyms-repository'

export class PrismaGymRepository implements GymsRepository {
  async searchMany(query: string, page: number): Promise<Gym[]> {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyGymsParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    return await prisma.gym.create({
      data,
    })
  }

  async findOneById(gym_id: string) {
    return await prisma.gym.findUnique({
      where: {
        id: gym_id,
      },
    })
  }
}
