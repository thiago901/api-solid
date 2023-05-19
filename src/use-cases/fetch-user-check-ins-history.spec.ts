import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository

let sut: FetchUserCheckInsHistoryUseCase

describe('Check In history Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should to be able to fetch  check-ins history', async () => {
    for (let index = 0; index < 2; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index + 1}`,
        user_id: 'user-01',
      })
    }
    const { checkIns } = await sut.execute({
      user_id: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ])
  })
  it('should to be able to fetch paginated check-ins history', async () => {
    for (let index = 0; index < 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index + 1}`,
        user_id: 'user-01',
      })
    }
    const { checkIns } = await sut.execute({
      user_id: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
