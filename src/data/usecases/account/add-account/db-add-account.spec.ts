import { Hasher, AccountModel, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAccountParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const mockAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryrStub implements AddAccountRepository {
    async add (): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryrStub()
}

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (): Promise<AccountModel | null> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const mockHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const mockSut = (): SutTypes => {
  const hasherStub = mockHasherStub()
  const addAccountRepositoryStub = mockAddAccountRepositoryStub()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  return {
    sut: new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub),
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = mockSut()

    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAccountParams())
    expect(encryptSpy).toHaveBeenCalledWith(mockAccountParams().password)
  })
  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = mockSut()

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = mockSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(mockAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: mockAccountParams().name,
      email: mockAccountParams().email,
      password: 'hashed_password'
    })
  })
  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = mockSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = mockSut()
    const account = await sut.add(mockAccountParams())
    expect(account).toEqual(mockAccountModel())
  })
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountParams())
    expect(loadSpy).toBeCalledWith(mockAccountParams().email)
  })
  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const accessToken = await sut.add(mockAccountParams())
    expect(accessToken).toBe(null)
  })
})
