import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsRequest {
  query: string
  page: number
}
interface SearchGymsResponse {
  gyms: Gym[]
}
export class SearchGyms {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    page,
    query,
  }: SearchGymsRequest): Promise<SearchGymsResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
