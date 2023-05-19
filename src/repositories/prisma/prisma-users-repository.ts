import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUserRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }

  async findOneByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findOneById(user_id: string) {
    return await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    })
  }
}
