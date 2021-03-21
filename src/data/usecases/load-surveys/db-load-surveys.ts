import { SurveyModel } from '@/domain/models/survey'
import { LoadSurvey } from '@/domain/usecases/load-survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'

export class DbLoadSurveys implements LoadSurvey {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
