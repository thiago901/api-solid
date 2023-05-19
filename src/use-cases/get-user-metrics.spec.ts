import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { GetUserMetricsCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository

let sut: GetUserMetricsCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new GetUserMetricsCase(checkInsRepository)
  })

  it('should to be able to get check-ins count from metrics', async () => {
    for (let index = 0; index < 2; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index + 1}`,
        user_id: 'user-01',
      })
    }
    const { checkInsCount } = await sut.execute({
      user_id: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
