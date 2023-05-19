import { UsersRepository } from '@/repositories/users-repository'

import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  user_id: string
}
interface GetUserProfileUseCaseResponse {
  user: User
}
export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    user_id,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findOneById(user_id)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
