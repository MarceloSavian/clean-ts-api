import { DbLoadSurveys } from '@/data/usecases/load-surveys/db-load-surveys'
import { LoadSurvey } from '@/domain/usecases/load-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurvey = (): LoadSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
