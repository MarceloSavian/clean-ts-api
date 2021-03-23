import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export const mockSaveSurveyResultParams = (surveyId?: string, accountId?: string): SaveSurveyResultParams => ({
  surveyId: surveyId || 'any_id',
  accountId: accountId || 'any_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (id?: string, surveyId?: string, accountId?: string): SurveyResultModel => ({
  id: id || 'any_id',
  ...mockSaveSurveyResultParams(surveyId, accountId)
})
