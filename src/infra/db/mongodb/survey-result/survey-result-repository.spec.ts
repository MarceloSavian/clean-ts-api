import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-repository'
import MockDate from 'mockdate'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

type SutTypes = {
  sut: SurveyResultMongoRepository
}

const mockFakeSurvey = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

const mockFakeAccountData = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const mockFakeSurveyResult = (surveyId: string, accountId: string): SaveSurveyResultParams => ({
  surveyId,
  accountId,
  answer: mockFakeSurvey().answers[0].answer,
  date: new Date()
})

const insertSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockFakeSurvey())
  return mongoHelper.map(res.ops[0])
}
const insertAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockFakeAccountData())
  return mongoHelper.map(res.ops[0])
}

const insertSurveyResult = async (surveyId: string, accountId: string): Promise<SurveyResultModel> => {
  const res = await surveyResultCollection.insertOne(mockFakeSurveyResult(surveyId, accountId))
  return mongoHelper.map(res.ops[0])
}

const mockFakeSurveyResultWithId = (id: string, surveyId: string, accountId: string): SurveyResultModel => ({
  id,
  ...mockFakeSurveyResult(surveyId, accountId)
})

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
      const surveyResult = await sut.save(mockFakeSurveyResult(
        survey.id,
        account.id
      ))
      expect(surveyResult).toEqual(mockFakeSurveyResultWithId(surveyResult.id, survey.id, account.id))
    })
    test('Should update Survey Result if its not new', async () => {
      const { sut } = mockSut()
      const survey = await insertSurvey()
      const account = await insertAccount()
      const res = await insertSurveyResult(
        survey.id,
        account.id
      )
      const surveyResult = await sut.save(mockFakeSurveyResult(
        survey.id,
        account.id
      ))
      expect(res.id).toEqual(surveyResult.id)
      expect(surveyResult).toEqual(mockFakeSurveyResultWithId(surveyResult.id, survey.id, account.id))
    })
  })
})
