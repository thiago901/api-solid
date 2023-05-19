import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyGymsParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenTwoCoordinates } from '@/utils/get-distance-between-two-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []
  async findOneById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }
    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
      title: data.title,
    }
    this.items.push(gym)
    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyGymsParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenTwoCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
