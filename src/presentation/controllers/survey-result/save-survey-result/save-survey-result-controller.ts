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

      const { answer } = httpRequest.body
      const answers = survey.answers.map(a => a.answer)

      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))

      return ok(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }
}
