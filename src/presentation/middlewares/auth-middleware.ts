import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (): Promise<HttpResponse> {
    return Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
