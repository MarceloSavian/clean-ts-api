import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'
import { mockLoadSurveysRepository } from '@/data/test'
import { mockSurveyModelArray } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const mockSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  return {
    sut: new DbLoadSurveys(loadSurveysRepositoryStub),
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = mockSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
  test('Should returns a list of surveys on success', async () => {
    const { sut } = mockSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveyModelArray())
  })
  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = mockSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
