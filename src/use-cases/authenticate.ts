import { UsersRepository } from '@/repositories/users-repository'

import { compare } from 'bcryptjs'
import { UserCredentialsInvalid } from './errors/user-credentials-invalid-error'
import { User } from '@prisma/client'

interface AuthenticateUserCaseRequest {
  email: string
  password: string
}
interface AuthenticateUserCaseResponse {
  user: User
}
export class AuthenticateUserCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserCaseRequest): Promise<AuthenticateUserCaseResponse> {
    const user = await this.userRepository.findOneByEmail(email)
    if (!user) {
      throw new UserCredentialsInvalid()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new UserCredentialsInvalid()
    }
    return {
      user,
    }
  }
}
