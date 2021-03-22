import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const mockFakeSurvey = (): SurveyModel[] => ([{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any'
  }],
  date: new Date()
}])

const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(mockFakeSurvey())
    }
  }
  return new LoadSurveysRepositoryStub()
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
    expect(surveys).toEqual(mockFakeSurvey())
  })
  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = mockSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
