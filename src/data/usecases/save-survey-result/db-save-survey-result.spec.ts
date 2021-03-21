import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultModel } from './db-save-survey-result-protocols'

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
  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.save(makeFakeSurveyResult())
    await expect(error).rejects.toThrow()
  })
  test('Should returns SurveyResult if succeds', async () => {
    const { sut } = makeSut()
    const res = await sut.save(makeFakeSurveyResult())
    expect(res).toEqual(makeFakeSurveyResultWithId())
  })
})
