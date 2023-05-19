import { expect, describe, it, beforeEach } from 'vitest'

import { GetUserProfileUseCase } from './getUserProfile'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should to be able get user profile', async () => {
    const createdUser = await userRepository.create({
      email: 'johndoe@mail.com',
      name: 'John Doe',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      user_id: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })
  it('should not to be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'non-exist-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
