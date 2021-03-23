import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
