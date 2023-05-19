import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsRequest {
  user_latitude: number
  user_longitude: number
}
interface FetchNearbyGymsResponse {
  gyms: Gym[]
}
export class FetchNearbyGyms {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    user_latitude,
    user_longitude,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: user_latitude,
      longitude: user_longitude,
    })

    return {
      gyms,
    }
  }
}
