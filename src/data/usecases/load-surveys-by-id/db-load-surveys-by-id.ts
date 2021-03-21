import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveysByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'

export class DbLoadSurveysById implements LoadSurveyById {
  constructor (
    private readonly loadSurveysByIdRepository: LoadSurveysByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    const surveys = await this.loadSurveysByIdRepository.loadById(id)
    return surveys
  }
}
