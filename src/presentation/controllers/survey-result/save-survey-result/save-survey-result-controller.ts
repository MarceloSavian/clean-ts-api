import {
  Controller,
  HttpRequest,
  HttpResponse,
  ok,
  LoadSurveyById,
  forbidden,
  InvalidParamError,
  serverError
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      return ok(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }
}
