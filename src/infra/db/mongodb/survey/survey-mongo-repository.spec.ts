import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

interface SutInterface {
  sut: SurveyMongoRepository
}

const makeSut = (): SutInterface => {
  return {
    sut: new SurveyMongoRepository()
  }
}

describe('Account Mongo Repository', () => {
  let surveyCollection: Collection
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
  test('Should insert Survey on success', async () => {
    const { sut } = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'any_answer'
        }
      ]
    })
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
