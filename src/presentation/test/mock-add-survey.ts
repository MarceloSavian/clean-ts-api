import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (): Promise<null> {
      return Promise.resolve(null)
    }
  }
  return new AddSurveyStub()
}
