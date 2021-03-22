import { mockLoadSurveysByIdRepository } from '@/data/test'
import { mockSurveyModel } from '@/domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveysById } from './db-load-surveys-by-id'
import { LoadSurveysByIdRepository } from './db-load-surveys-by-id-protocols'

type SutTypes = {
  sut: DbLoadSurveysById
  loadSurveysByIdRepositoryStub: LoadSurveysByIdRepository
}

const mockSut = (): SutTypes => {
  const loadSurveysByIdRepositoryStub = mockLoadSurveysByIdRepository()
  return {
    sut: new DbLoadSurveysById(loadSurveysByIdRepositoryStub),
    loadSurveysByIdRepositoryStub
  }
}

describe('DbLoadSurveysByIdById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysByIdRepository', async () => {
    const { sut, loadSurveysByIdRepositoryStub } = mockSut()
    const loadByIdSpy = jest.spyOn(loadSurveysByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should returns a survey on success', async () => {
    const { sut } = mockSut()
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(mockSurveyModel())
  })
  test('Should throw if LoadSurveysByIdRepository throws', async () => {
    const { sut, loadSurveysByIdRepositoryStub } = mockSut()
    jest.spyOn(loadSurveysByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
