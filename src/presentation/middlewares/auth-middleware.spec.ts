import { HttpRequest } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

interface SutInterface {
  sut: AuthMiddleware
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeSut = (): SutInterface => {
  return {
    sut: new AuthMiddleware()
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle()
    makeFakeRequest()
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
