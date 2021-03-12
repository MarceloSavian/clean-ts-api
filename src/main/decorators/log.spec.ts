import { LogErrorRepository } from '../../data/protocols/log-error-repository copy'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutInterface {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: {
          email: 'any_mail@mail.com',
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        },
        statusCode: 200
      }
      return Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutInterface => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  return {
    sut: new LogControllerDecorator(controllerStub, logErrorRepositoryStub),
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  test('Shoul call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenLastCalledWith(httpRequest)
  })
  test('Shoul return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const res = await sut.handle(httpRequest)

    expect(res).toEqual({
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      },
      statusCode: 200
    })
  })
  test('Shoul call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toBeCalledWith('any_stack')
  })
})
