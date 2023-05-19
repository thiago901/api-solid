import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  check_in_id: string
}
interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}
export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    check_in_id,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findOneById(check_in_id)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distaceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minute',
    )

    const TWENTYMINUTES = 20
    if (distaceInMinutesFromCheckInCreation > TWENTYMINUTES) {
      throw new LateCheckInValidationError()
    }
    checkIn.validated_at = new Date()
    await this.checkInsRepository.save(checkIn)
    return {
      checkIn,
    }
  }
}
