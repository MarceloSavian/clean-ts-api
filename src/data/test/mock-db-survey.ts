import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModelArray } from '@/domain/test/mock-survey'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveysByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '../protocols/db/survey/load-survey-repository'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (): Promise<null> {
      return Promise.resolve(null)
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModelArray())
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const mockLoadSurveysByIdRepository = (): LoadSurveysByIdRepository => {
  class LoadSurveysByIdRepositoryStub implements LoadSurveysByIdRepository {
    async loadById (): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveysByIdRepositoryStub()
}
