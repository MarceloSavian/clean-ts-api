import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultParams } from './db-save-survey-result-protocols'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const mockFakeSurveyResult = (): SaveSurveyResultParams => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: new Date()
})

const mockFakeSurveyResultWithId = (): SurveyResultModel => ({
  id: 'any_id',
  ...mockFakeSurveyResult()
})

const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (): Promise<SurveyResultModel> {
      return Promise.resolve(mockFakeSurveyResultWithId())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const mockSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
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
    const { sut, saveSurveyResultRepositoryStub } = mockSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(mockFakeSurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(mockFakeSurveyResult())
  })
  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = mockSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.save(mockFakeSurveyResult())
    await expect(error).rejects.toThrow()
  })
  test('Should returns SurveyResult if succeds', async () => {
    const { sut } = mockSut()
    const res = await sut.save(mockFakeSurveyResult())
    expect(res).toEqual(mockFakeSurveyResultWithId())
  })
})
