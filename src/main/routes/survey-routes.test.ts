import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
  test('Should return 204 on survey with access-token', async () => {
    const res = await accountCollection.insertOne({
      name: 'Test',
      emai: 'test@gmail.com',
      password: 'any_passowrd',
      role: 'admin'
    })
    const id = res.ops[0]._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
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
      .expect(204)
  })
})
