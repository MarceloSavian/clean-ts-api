import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
