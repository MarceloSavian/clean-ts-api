import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accesToken = httpRequest?.headers?.['x-access-token']
    if (!accesToken) return forbidden(new AccessDeniedError())

    const account = await this.loadAccountByToken.load(httpRequest.headers['x-access-token'])
    if (!account) return forbidden(new AccessDeniedError())

    return ok({ accountId: account.id })
  }
}
