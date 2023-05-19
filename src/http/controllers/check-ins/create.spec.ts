import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('CheckIn (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('Should be able to create a check-in gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const gym = await prisma.gym.create({
      data: {
        description: '',
        latitude: -23.6641154,
        longitude: -46.8471927,
        phone: '119999-2221',
        title: 'Js Gym',
      },
    })
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.6641154,
        longitude: -46.8471927,
      })

    expect(response.statusCode).toEqual(201)
  })
})
