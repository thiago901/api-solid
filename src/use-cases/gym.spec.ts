import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GymUseCase } from './gym'

let gymRepository: InMemoryGymsRepository
let sut: GymUseCase
describe('Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new GymUseCase(gymRepository)
  })
  it('should to be able create a Gym', async () => {
    const { gym } = await sut.execute({
      description: '',
      latitude: -23.6641154,
      longitude: -46.8471927,
      phone: '',
      title: 'Js Gym',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
