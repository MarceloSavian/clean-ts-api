import { SurveyModel } from '@/domain/models/survey'
import { DbLoadSurveysById } from './db-load-surveys-by-id'
import MockDate from 'mockdate'
import { LoadSurveysByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

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
    async loadById (): Promise<SurveyModel> {
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
})