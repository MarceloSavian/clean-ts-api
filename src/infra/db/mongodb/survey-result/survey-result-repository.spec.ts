import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-repository'
import MockDate from 'mockdate'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { mockAccountParams, mockAddSurveyParams, mockSaveSurveyResultParams } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

type SutTypes = {
  sut: SurveyResultMongoRepository
}

const insertSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return mongoHelper.map(res.ops[0])
}
const insertAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAccountParams())
  return mongoHelper.map(res.ops[0])
}

const insertSurveyResult = async (surveyId: string, accountId: string, answer: string): Promise<SurveyResultModel> => {
  const res = await surveyResultCollection.insertOne(mockSaveSurveyResultParams(surveyId, accountId, answer))
  return mongoHelper.map(res.ops[0])
}

const mockSut = (): SutTypes => {
  return {
    sut: new SurveyResultMongoRepository()
  }
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await mongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('save()', () => {
    test('Should insert Survey Result if its new', async () => {
      const { sut } = mockSut()
      const survey = await insertSurvey()
      const account = await insertAccount()
      const surveyResult = await sut.save(mockSaveSurveyResultParams(
        survey.id,
        account.id,
        survey.answers[0].answer
      ))
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
    test('Should update Survey Result if its not new', async () => {
      const { sut } = mockSut()
      const survey = await insertSurvey()
      const account = await insertAccount()
      await insertSurveyResult(
        survey.id,
        account.id,
        survey.answers[0].answer
      )
      const surveyResult = await sut.save(mockSaveSurveyResultParams(
        survey.id,
        account.id,
        survey.answers[1].answer
      ))
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
  })
})
