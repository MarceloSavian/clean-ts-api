import { SurveyAnswer } from '@/domain/models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add (data: AddSurveyModel): Promise<null>
}
