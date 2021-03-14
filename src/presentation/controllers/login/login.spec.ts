import { Authentication, EmailValidator, HttpRequest } from './login-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'
import { Validation } from '../../helpers/validators/validation'

interface SutInterface {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutInterface => {
  const emailValidator = makeEmailValidator()
  const authentication = makeAuthentication()
  const validationStub = makeValidation()
  return {
    sut: new LoginController(authentication, validationStub),
    emailValidator,
    authentication,
    validationStub
  }
}

describe('Login Controlle', () => {
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut } = makeSut()

    jest.spyOn(sut, 'handle').mockReturnValueOnce(Promise.resolve(badRequest(new InvalidParamError('email'))))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()

    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith(makeFakeRequest().body.email, makeFakeRequest().body.password)
  })
  test('Should return 401 invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication Throws', async () => {
    const { sut, authentication } = makeSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(serverError(new Error()))
  })
  test('Should return 200 valid credentials are provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(ok({
      accessToken: 'any_token'
    }))
  })
  test('Should call Validtion with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
