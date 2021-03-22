import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryrStub implements AddAccountRepository {
    async add (): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryrStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
