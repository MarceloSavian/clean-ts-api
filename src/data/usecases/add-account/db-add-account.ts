import { AccountModel, Hasher, AddAccountModel, AddAccount, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const newPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: newPassword })
    return Promise.resolve(account)
  }
}
