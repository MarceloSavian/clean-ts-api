import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurvey, SurveyModel } from './load-surveys-controller-protocols'
import MockDate from 'mockdate'

interface SutInterface {
  sut: LoadSurveysController
  loadSurveyStub: LoadSurvey
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

const makeLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyStub()
}

const makeSut = (): SutInterface => {
  const loadSurveyStub = makeLoadSurvey()
  return {
    sut: new LoadSurveysController(loadSurveyStub),
    loadSurveyStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle()
    expect(loadSpy).toHaveBeenCalled()
  })
})
