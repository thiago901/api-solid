import { CheckIn, Prisma } from '@prisma/client'

import { randomUUID } from 'crypto'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,

      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }
    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(
    user_id: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnTheSameDay = this.items.find((item) => {
      const checkinDate = dayjs(item.created_at)
      const isOnTheSameDay =
        checkinDate.isAfter(startOfTheDay) && checkinDate.isBefore(endOfTheDay)
      return user_id === item.user_id && isOnTheSameDay
    })
    if (!checkInOnTheSameDay) {
      return null
    }
    return checkInOnTheSameDay
  }

  async findManyByUserId(user_id: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.items
      .filter((item) => item.user_id === user_id)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async countByUserId(user_id: string): Promise<number> {
    const count = this.items.filter((item) => item.user_id === user_id).length
    return count
  }

  async findOneById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }
    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const findIndexCheckIn = this.items.findIndex(
      (item) => item.id === checkIn.id,
    )
    if (findIndexCheckIn >= 0) {
      this.items[findIndexCheckIn] = {
        ...this.items[findIndexCheckIn],
        ...checkIn,
      }
    }
    return checkIn
  }
}
