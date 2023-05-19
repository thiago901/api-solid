import { expect, describe, it, beforeEach } from 'vitest'

import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGyms } from './fetch-nearby-gyms'

let gymsRepository: GymsRepository

let sut: FetchNearbyGyms

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new FetchNearbyGyms(gymsRepository)
  })

  it('should to be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      description: '',
      latitude: -23.6290291,
      longitude: -46.7149372,
      phone: '',
      title: 'Near Gym',
    })
    await gymsRepository.create({
      description: '',
      latitude: -23.5733764,
      longitude: -46.8242914,
      phone: '',
      title: 'Far Gym',
    })

    const { gyms } = await sut.execute({
      user_latitude: -23.6290291,
      user_longitude: -46.7149372,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
