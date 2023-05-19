import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenTwoCoordinates } from '@/utils/get-distance-between-two-coordinates'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

interface CheckInUseCaseRequest {
  user_id: string
  user_longitude: number
  user_latitude: number
  gym_id: string
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn
}
export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    user_id,
    gym_id,
    user_latitude,
    user_longitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findOneById(gym_id)

    if (!gym) {
      throw new ResourceNotFoundError()
    }
    const distance = getDistanceBetweenTwoCoordinates(
      { latitude: user_latitude, longitude: user_longitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }
    const checkInOnTheSameDay =
      await this.checkInsRepository.findByUserIdOnDate(user_id, new Date())

    if (checkInOnTheSameDay) {
      throw new MaxNumberOfCheckInsError()
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id,
      user_id,
    })

    return {
      checkIn,
    }
  }
}
