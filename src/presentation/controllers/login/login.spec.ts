import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'

interface SutInterface {
  sut: LoginController
  emailValidator: EmailValidator
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
  return {
    sut: new LoginController(emailValidator),
    emailValidator
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

    await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    })

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  // test('Should return 500 if an invalid email is provided', async () => {
  //   const { sut } = makeSut()

  //   const emailSpy = jest.spyOn(sut, 'handle')

  //   const response = await sut.handle({
  //     body: {
  //       email: 'any_email@mail.com'
  //     }
  //   })

  //   expect(response).toEqual(badRequest(new MissingParamError('password')))
  // })
})
