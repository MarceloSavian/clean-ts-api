import { SurveyAnswer } from '@/domain/models/survey'

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<null>
}
