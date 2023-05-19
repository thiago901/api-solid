import { expect, describe, it, beforeEach } from 'vitest'

import { SearchGyms } from './search-gyms'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRpeository: GymsRepository

let sut: SearchGyms

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRpeository = new InMemoryGymsRepository()

    sut = new SearchGyms(gymsRpeository)
  })

  it('should to be able to search for gyms', async () => {
    await gymsRpeository.create({
      description: '',
      latitude: -23.6641154,
      longitude: -46.8471927,
      phone: '',
      title: 'Javascript Gym',
    })
    await gymsRpeository.create({
      description: '',
      latitude: -23.6641154,
      longitude: -46.8471927,
      phone: '',
      title: 'Typescript Gym',
    })
    const { gyms } = await sut.execute({
      query: 'Java',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })
  it('should to be able to fetch paginated gyms search', async () => {
    for (let index = 0; index < 22; index++) {
      await gymsRpeository.create({
        description: '',
        latitude: -23.6641154,
        longitude: -46.8471927,
        phone: '',
        title: `Javascript Gym - ${index + 1}`,
      })
    }
    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym - 21' }),
      expect.objectContaining({ title: 'Javascript Gym - 22' }),
    ])
  })
})
