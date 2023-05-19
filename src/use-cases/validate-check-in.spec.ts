import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository

let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new ValidateCheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should to be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })
    const { checkIn } = await sut.execute({
      check_in_id: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not to be able to validate the inexist check in', async () => {
    await expect(() =>
      sut.execute({
        check_in_id: 'non-exist-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not to be able to validate the check in after 20min of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym_id',
      user_id: 'user_id',
    })
    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        check_in_id: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
