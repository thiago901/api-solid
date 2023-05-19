import { UsersRepository } from '@/repositories/users-repository'

import { hash } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface IRegiterUseCase {
  name: string
  email: string
  password: string
}
interface RegiterUseCaseResponse {
  user: User
}
export class RegiterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: IRegiterUseCase): Promise<RegiterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findOneByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const user = await this.userRepository.create({
      email,
      name,
      password_hash,
    })

    return {
      user,
    }
  }
}
