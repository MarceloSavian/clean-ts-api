import { SignUpController } from './signup-controller'
import { ServerError, EmailInUseError } from '@/presentation/errors'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, Authentication } from './signup-controller-protocols'
import { HttpRequest } from '@/presentation/protocols'
import { serverError, badRequest, ok, forbidden } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { mockAccountModel } from '@/domain/test'

const mockFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authentication: Authentication
}

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const mockAddAcount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (): Promise<AccountModel | null> {
      const fakeAccount = mockAccountModel()

      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

const mockSut = (): SutTypes => {
  const addAccountStub = mockAddAcount()
  const validationStub = mockValidation()
  const authentication = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authentication)
  return {
    sut,
    addAccountStub,
    validationStub,
    authentication
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = mockSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = mockFakeRequest()

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = mockSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = mockSut()

    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
  test('Should call Validation with correct values', async () => {
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
  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = mockSut()

    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(mockFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: mockFakeRequest().body.email,
      password: mockFakeRequest().body.password
    })
  })

  test('Should return 500 if Authentication Throws', async () => {
    const { sut, authentication } = mockSut()

    jest.spyOn(authentication, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockFakeRequest())

    expect(response).toEqual(serverError(new Error()))
  })
  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = mockSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
