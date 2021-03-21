import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository'
import { DbLoadSurveys } from './db-load-surveys'

interface SutInterface {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeFakeSurvey = (): SurveyModel[] => ([{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any'
  }],
  date: new Date()
}])

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutInterface => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  return {
    sut: new DbLoadSurveys(loadSurveysRepositoryStub),
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
