import { SurveyModel, LoadSurveysByIdRepository, LoadSurveyById } from './db-load-surveys-by-id-protocols'

export class DbLoadSurveysById implements LoadSurveyById {
  constructor (
    private readonly loadSurveysByIdRepository: LoadSurveysByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    const surveys = await this.loadSurveysByIdRepository.loadById(id)
    return surveys
  }
}
