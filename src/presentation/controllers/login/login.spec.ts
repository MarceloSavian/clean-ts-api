import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutInterface {
  sut: LoginController
}

const makeSut = (): SutInterface => {
  return {
    sut: new LoginController()
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
})
