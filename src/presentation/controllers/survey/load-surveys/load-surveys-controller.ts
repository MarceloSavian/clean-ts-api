import { ok } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurvey } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurvey
  ) {}

  async handle (): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return ok(surveys)
  }
}
