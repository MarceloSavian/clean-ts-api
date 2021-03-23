import {
  HashCompare,
  Encrypter,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository
} from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'
import { mockAccountModel, mockAuthentication } from '@/domain/test'
import { mockEncrypter, mockHashCompare, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const mockSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashCompareStub = mockHashCompare()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockAuthentication())
    expect(loadSpy).toBeCalledWith(mockAuthentication().email)
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBe(null)
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = mockSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(mockAuthentication())
    expect(compareSpy).toBeCalledWith(mockAuthentication().password, mockAccountModel().password)
  })
  test('Should throw if HashComparer throws', async () => {
    const { sut, hashCompareStub } = mockSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashCompareStub } = mockSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBe(null)
  })

  test('Should call Encrypter with correct email', async () => {
    const { sut, encrypterStub } = mockSut()
    const loadSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthentication())
    expect(loadSpy).toBeCalledWith(mockAccountModel().id)
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = mockSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return token if everything succeds', async () => {
    const { sut } = mockSut()
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBe('any_token')
  })
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = mockSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockAuthentication())
    expect(updateSpy).toBeCalledWith(mockAccountModel().id, 'any_token')
  })
  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = mockSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
