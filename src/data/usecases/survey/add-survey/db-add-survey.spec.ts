import { AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const mockFakeAddSurvey = (): AddSurveyParams => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (): Promise<null> {
      return Promise.resolve(null)
    }
  }
  return new AddSurveyRepositoryStub()
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
    await sut.add(mockFakeAddSurvey())
    expect(addSpy).toHaveBeenCalledWith(mockFakeAddSurvey())
  })
  test('Should throws if AddSurveyREpository throws', async () => {
    const { sut, addSurveyRepositoryStub } = mockSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.add(mockFakeAddSurvey())
    await expect(error).rejects.toThrow()
  })
  test('Should returns null if succeds', async () => {
    const { sut } = mockSut()
    const res = await sut.add(mockFakeAddSurvey())
    expect(res).toBeNull()
  })
})
