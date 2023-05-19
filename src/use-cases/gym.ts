import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface IGymUseCase {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}
interface GymUseCaseResponse {
  gym: Gym
}
export class GymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: IGymUseCase): Promise<GymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      latitude,
      longitude,
      phone,
      title,
    })

    return {
      gym,
    }
  }
}
