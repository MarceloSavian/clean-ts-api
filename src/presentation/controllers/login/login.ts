import { Authentication, Controller, HttpRequest, HttpResponse } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const token = await this.authentication.auth(email, password)

      if (!token) {
        return unauthorized()
      }

      return Promise.resolve(ok({
        accessToken: token
      }))
    } catch (error) {
      return serverError(error)
    }
  }
}
