import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsCaseRequest {
  user_id: string
}
interface GetUserMetricsCaseResponse {
  checkInsCount: number
}
export class GetUserMetricsCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
  }: GetUserMetricsCaseRequest): Promise<GetUserMetricsCaseResponse> {
    const count = await this.checkInsRepository.countByUserId(user_id)

    return {
      checkInsCount: count,
    }
  }
}
