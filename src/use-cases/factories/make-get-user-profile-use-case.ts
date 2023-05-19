import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../getUserProfile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUserRepository()
  const getUserProfile = new GetUserProfileUseCase(usersRepository)
  return getUserProfile
}
