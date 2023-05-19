import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
    this.items.push(user)

    return user
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findOneById(user_id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === user_id)
    if (!user) {
      return null
    }
    return user
  }
}
