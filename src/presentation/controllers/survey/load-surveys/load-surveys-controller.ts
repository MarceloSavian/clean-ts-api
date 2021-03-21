import { ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurvey } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurvey
  ) {}

  async handle (): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
