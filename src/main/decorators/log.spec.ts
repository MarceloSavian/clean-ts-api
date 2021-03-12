import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  test('Shoul call controller handle', async () => {
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
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
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
