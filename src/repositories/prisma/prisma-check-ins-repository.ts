import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return prisma.checkIn.create({
      data,
    })
  }

  async findByUserIdOnDate(user_id: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIns = await prisma.checkIn.findFirst({
      where: {
        user_id,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
    return checkIns
  }

  async findManyByUserId(user_id: string, page: number) {
    return prisma.checkIn.findMany({
      where: {
        user_id,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async countByUserId(id: string) {
    return prisma.checkIn.count({
      where: {
        user_id: id,
      },
    })
  }

  async findOneById(id: string) {
    return prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
  }

  async save(data: CheckIn) {
    await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return data
  }
}
