import { Collection } from 'mongodb'
import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection

describe('Auth routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on survey without access-token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'image'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })
  })
})
