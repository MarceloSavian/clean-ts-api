import { Authentication } from '@/domain/usecases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}
