import { LoadAccountByEmailRepository } from '@/data/usecases/account/authentication/db-authentication-protocols'
import { AccountModel, Hasher, AddAccountParams, AddAccount, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<AccountModel | null> {
    const searchAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (searchAccount) return null

    const newPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: newPassword })
    return Promise.resolve(account)
  }
}
