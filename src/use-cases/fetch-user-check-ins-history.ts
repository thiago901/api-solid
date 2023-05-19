import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
  user_id: string
  page: number
}
interface FetchUserCheckInsHistoryCaseResponse {
  checkIns: CheckIn[]
}
export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    page,
    user_id,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      user_id,
      page,
    )
    return {
      checkIns,
    }
  }
}
