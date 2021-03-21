import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeFakeSurveyResult = (): SaveSurveyResultModel => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  asnwer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResultWithId = (): SurveyResultModel => ({
  id: 'any_id',
  ...makeFakeSurveyResult()
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResultWithId())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  return {
    sut: new DbSaveSurveyResult(saveSurveyResultRepositoryStub),
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeSurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResult())
  })
})
