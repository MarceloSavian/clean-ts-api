import { AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
import { mockAddSurveyRepository } from '@/data/test'
import { mockAddSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const mockSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  return {
    sut: new DbAddSurvey(addSurveyRepositoryStub),
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call AddSurveyREpository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = mockSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(mockAddSurveyParams())
    expect(addSpy).toHaveBeenCalledWith(mockAddSurveyParams())
  })
  test('Should throws if AddSurveyREpository throws', async () => {
    const { sut, addSurveyRepositoryStub } = mockSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.add(mockAddSurveyParams())
    await expect(error).rejects.toThrow()
  })
  test('Should returns null if succeds', async () => {
    const { sut } = mockSut()
    const res = await sut.add(mockAddSurveyParams())
    expect(res).toBeNull()
  })
})
