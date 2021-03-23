import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken, HttpRequest } from './auth-middleware-protocols'
import { mockAccountModel } from '@/domain/test'
import { mockLoadAccountByToken } from '../test'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const mockSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  return {
    sut: new AuthMiddleware(loadAccountByTokenStub, role),
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = mockSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call LoadAccountByTokent with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = mockSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith(mockRequest().headers['x-access-token'], role)
  })
  test('Should return 403 LoadAccountByTokent returns null', async () => {
    const { sut, loadAccountByTokenStub } = mockSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 LoadAccountByTokent returns an account', async () => {
    const { sut } = mockSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: mockAccountModel().id }))
  })

  test('Should return 500 LoadAccountByTokent throws', async () => {
    const { sut, loadAccountByTokenStub } = mockSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
