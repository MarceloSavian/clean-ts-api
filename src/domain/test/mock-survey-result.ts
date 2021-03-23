import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export const mockSaveSurveyResultParams = (surveyId?: string, accountId?: string, answer?: string): SaveSurveyResultParams => ({
  surveyId: surveyId || 'any_id',
  accountId: accountId || 'any_id',
  answer: answer || 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (surveyId?: string): SurveyResultModel => ({
  surveyId: surveyId || 'any_id',
  question: 'any_id',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 1,
    percent: 100
  }],
  date: new Date()
})
