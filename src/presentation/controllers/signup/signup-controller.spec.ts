import { SignUpController } from './signup-controller'
import { ServerError } from '../../errors'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount } from './signup-controller-protocols'
import { HttpRequest } from '../../protocols'
import { serverError, badRequest, ok } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddAcount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAcount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
