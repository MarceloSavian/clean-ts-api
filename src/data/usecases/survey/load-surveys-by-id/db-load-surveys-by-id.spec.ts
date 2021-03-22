import MockDate from 'mockdate'
import { DbLoadSurveysById } from './db-load-surveys-by-id'
import { LoadSurveysByIdRepository, SurveyModel } from './db-load-surveys-by-id-protocols'

type SutTypes = {
  sut: DbLoadSurveysById
  loadSurveysByIdRepositoryStub: LoadSurveysByIdRepository
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any'
  }],
  date: new Date()
})

const makeLoadSurveysByIdRepository = (): LoadSurveysByIdRepository => {
  class LoadSurveysByIdRepositoryStub implements LoadSurveysByIdRepository {
    async loadById (): Promise<SurveyModel | null> {
      return Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveysByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysByIdRepositoryStub = makeLoadSurveysByIdRepository()
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
    const { sut, loadSurveysByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveysByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should returns a survey on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(makeFakeSurvey())
  })
  test('Should throw if LoadSurveysByIdRepository throws', async () => {
    const { sut, loadSurveysByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
