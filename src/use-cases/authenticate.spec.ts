import { expect, describe, it, beforeEach } from 'vitest'

import { AuthenticateUserCase } from './authenticate'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { UserCredentialsInvalid } from './errors/user-credentials-invalid-error'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUserCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserCase(userRepository)
  })

  it('should to be able authenticate', async () => {
    await userRepository.create({
      email: 'johndoe@mail.com',
      name: 'John Doe',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not to be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserCredentialsInvalid)
  })
  it('should not to be able to authenticate with wrong password', async () => {
    await userRepository.create({
      email: 'johndoe@mail.com',
      name: 'John Doe',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@mail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserCredentialsInvalid)
  })
})
