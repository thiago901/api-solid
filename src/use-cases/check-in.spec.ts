import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym_id',
      description: 'Academia',
      latitude: 0,
      longitude: 0,
      phone: '',
      title: 'Titulo academia',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should to be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gym_id: 'gym_id',
      user_id: 'user_id',
      user_latitude: 0,
      user_longitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not to be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))
    await sut.execute({
      gym_id: 'gym_id',
      user_id: 'user_id',
      user_latitude: 0,
      user_longitude: 0,
    })

    await expect(() =>
      sut.execute({
        gym_id: 'gym_id',
        user_id: 'user_id',
        user_latitude: 0,
        user_longitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should to be able to check in twice but in diferent day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0))
    await sut.execute({
      gym_id: 'gym_id',
      user_id: 'user_id',
      user_latitude: 0,
      user_longitude: 0,
    })
    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gym_id: 'gym_id',
      user_id: 'user_id',
      user_latitude: 0,
      user_longitude: 0,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkin distance gym', async () => {
    const gym = await gymsRepository.create({
      description: 'Academia',
      latitude: -23.6426521,
      longitude: -46.6974181,
      phone: '',
      title: 'Titulo academia',
    })

    expect(() =>
      sut.execute({
        gym_id: gym.id,
        user_id: 'user_id',
        user_latitude: -23.6641154,
        user_longitude: -46.8471927,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
