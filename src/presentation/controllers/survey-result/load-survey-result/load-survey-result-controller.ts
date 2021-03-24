import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params

    const result = await this.loadSurveyById.loadById(surveyId)
    return ok(result)
  }
}
