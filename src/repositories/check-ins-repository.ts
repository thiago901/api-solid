import { CheckIn, Prisma } from '@prisma/client'
export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(user_id: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>
  countByUserId(id: string): Promise<number>
  findOneById(id: string): Promise<CheckIn | null>
  save(checkIn: CheckIn): Promise<CheckIn>
}
