import { Authentication, EmailValidator, HttpRequest } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { LoginController } from './login-controller'
import { Validation } from '@/presentation/protocols/validation'
import { mockAuthentication, mockEmailValidator, mockValidation } from '@/presentation/test'

type SutTypes = {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
  validationStub: Validation
}

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const mockSut = (): SutTypes => {
  const emailValidator = mockEmailValidator()
  const authentication = mockAuthentication()
  const validationStub = mockValidation()
  return {
    sut: new LoginController(authentication, validationStub),
    emailValidator,
    authentication,
    validationStub
  }
}

describe('Login Controlle', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = mockSut()

    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(mockRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: mockRequest().body.email,
      password: mockRequest().body.password
    })
  })
  test('Should return 401 invalid credentials are provided', async () => {
    const { sut, authentication } = mockSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication Throws', async () => {
    const { sut, authentication } = mockSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })
  test('Should return 200 valid credentials are provided', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(ok({
      accessToken: 'any_token'
    }))
  })
  test('Should call Validtion with correct values', async () => {
    const { sut, validationStub } = mockSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = mockSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
