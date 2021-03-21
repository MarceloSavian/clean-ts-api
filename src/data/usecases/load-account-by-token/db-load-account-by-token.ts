import { LoadAccountByToken, Decrypter, LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    if (!token) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    return account
  }
}
