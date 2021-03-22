import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/data/test'
import { mockAccountModel } from '@/domain/test'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const mockFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const mockFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(mockAccountModel())
      return Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

const mockSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  return {
    sut: new LogControllerDecorator(controllerStub, logErrorRepositoryStub),
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  test('Shoul call controller handle', async () => {
    const { sut, controllerStub } = mockSut()

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
    const { sut } = mockSut()

    const httpRequest: HttpRequest = {
      body: mockFakeRequest()
    }

    const res = await sut.handle(httpRequest)

    expect(res).toEqual(
      ok(mockAccountModel())
    )
  })
  test('Shoul call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = mockSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(mockFakeServerError()))

    const httpRequest: HttpRequest = {
      body: mockFakeRequest()
    }

    await sut.handle(httpRequest)

    expect(logSpy).toBeCalledWith('any_stack')
  })
})
