import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutInterface {
  sut: LogControllerDecorator
  controllerStub: Controller
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
  return {
    sut: new LogControllerDecorator(controllerStub),
    controllerStub
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
})
