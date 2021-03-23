import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, Decrypter } from './db-load-account-by-token-protocols'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const mockSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  return {
    sut: new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub),
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByTokent UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = mockSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenLastCalledWith('any_token')
  })
  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = mockSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const accounnt = await sut.load('any_token', 'any_role')
    expect(accounnt).toBeNull()
  })
  test('Should call LoadAccountByTokentRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = mockSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenLastCalledWith('any_token', 'any_role')
  })
  test('Should return null if LoadAccountByTokentRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const accounnt = await sut.load('any_token', 'any_role')
    expect(accounnt).toBeNull()
  })
  test('Should throws if Decrypter throws', async () => {
    const { sut, decrypterStub } = mockSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throws if LoadAccountByTokentRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
