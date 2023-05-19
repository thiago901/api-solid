import { expect, describe, it, beforeEach } from 'vitest'
import { RegiterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let sut: RegiterUseCase
describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegiterUseCase(userRepository)
  })
  it('should to be able register', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      name: 'John Doe',
      password: '123456',
    })
    const isPasswordCorrectHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@mail.com'

    await sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        email,
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
