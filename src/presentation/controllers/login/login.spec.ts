import { Authentication, EmailValidator, HttpRequest } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutInterface {
  sut: LoginController
  emailValidator: EmailValidator
  authentication: Authentication
}

const makeFakeHttpRequest = (): HttpRequest => ({
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

const makeSut = (): SutInterface => {
  const emailValidator = makeEmailValidator()
  const authentication = makeAuthentication()
  return {
    sut: new LoginController(emailValidator, authentication),
    emailValidator,
    authentication
  }
}

describe('Login Controlle', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      body: {
        password: 'any_password'
      }
    })

    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      body: {
        email: 'any_email@mail.com'
      }
    })

    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should call EmailValidator with correct values', async () => {
    const { sut, emailValidator } = makeSut()

    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(makeFakeHttpRequest())

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should return 400 if an invalid email is provided', async () => {
    const { sut } = makeSut()

    jest.spyOn(sut, 'handle').mockReturnValueOnce(Promise.resolve(badRequest(new InvalidParamError('email'))))

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should return 500 if EmailValidator Throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()

    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(makeFakeHttpRequest())

    expect(authSpy).toHaveBeenCalledWith(makeFakeHttpRequest().body.email, makeFakeHttpRequest().body.password)
  })
  test('Should return 401 invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(unauthorized())
  })
})
