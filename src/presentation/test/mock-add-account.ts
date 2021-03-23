import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccount } from '@/domain/usecases/account/add-account'

export const mockAddAcount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}
