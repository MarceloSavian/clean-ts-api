import { Collection } from 'mongodb'
import request from 'supertest'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeSurveyResult = (): SaveSurveyResultModel => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: new Date()
})

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
        .send(makeFakeSurveyResult())
        .expect(403)
    })
  })
})
