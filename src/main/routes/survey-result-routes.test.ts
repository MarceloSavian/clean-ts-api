import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'
import { SurveyModel } from '@/domain/models/survey'
import { mockAddSurveyParams, mockSaveSurveyResultParams } from '@/domain/test'

let surveyCollection: Collection
let accountCollection: Collection

const mockUserOnCollection = async (role?: string): Promise<any> => {
  let userData: any = {
    name: 'Test',
    emai: 'test@gmail.com',
    password: 'any_password'
  }
  if (role) userData = { ...userData, role }

  const res = await accountCollection.insertOne(userData)
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const insertSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return mongoHelper.map(res.ops[0])
}

describe('SurveyResult routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save-survey-result without access-token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send(mockSaveSurveyResultParams())
        .expect(403)
    })
    test('Should return 200 on save-survey-result with access-token', async () => {
      const accessToken = await mockUserOnCollection('admin')
      const surveyId = await insertSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId.id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: mockSaveSurveyResultParams(surveyId.id).answer
        })
        .expect(200)
    })
  })
})
