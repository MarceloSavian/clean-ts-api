import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModelArray } from '@/domain/test'
import { LoadSurvey } from '@/domain/usecases/survey/load-survey'

export const mockLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModelArray())
    }
  }
  return new LoadSurveyStub()
}
