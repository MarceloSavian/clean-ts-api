import { Authentication, EmailValidator, HttpRequest } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { LoginController } from './login-controller'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
  validationStub: Validation
}

const mockFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

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

    await sut.handle(mockFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: mockFakeRequest().body.email,
      password: mockFakeRequest().body.password
    })
  })
  test('Should return 401 invalid credentials are provided', async () => {
    const { sut, authentication } = mockSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(mockFakeRequest())

    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication Throws', async () => {
    const { sut, authentication } = mockSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockFakeRequest())

    expect(response).toEqual(serverError(new Error()))
  })
  test('Should return 200 valid credentials are provided', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockFakeRequest())

    expect(response).toEqual(ok({
      accessToken: 'any_token'
    }))
  })
  test('Should call Validtion with correct values', async () => {
    const { sut, validationStub } = mockSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = mockFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = mockSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
