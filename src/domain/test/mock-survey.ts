import { AddSurveyParams } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols'

export const mockSurveyModelArray = (): SurveyModel[] => ([mockSurveyModel()])

export const mockSurveyModel = (id?: string): SurveyModel => ({
  id: id || 'any_id',
  ...mockAddSurveyParams()
})

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer_2'
    },
    {
      answer: 'any_answer_3'
    }
  ],
  date: new Date()
})
