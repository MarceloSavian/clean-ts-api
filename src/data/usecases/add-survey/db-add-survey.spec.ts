import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeFakeAddSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (): Promise<null> {
      return Promise.resolve(null)
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
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
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeAddSurvey())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSurvey())
  })
  test('Should throws if AddSurveyREpository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const error = sut.add(makeFakeAddSurvey())
    await expect(error).rejects.toThrow()
  })
  test('Should returns null if succeds', async () => {
    const { sut } = makeSut()
    const res = await sut.add(makeFakeAddSurvey())
    expect(res).toBeNull()
  })
})
