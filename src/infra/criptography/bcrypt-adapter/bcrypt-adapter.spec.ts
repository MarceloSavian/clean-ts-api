import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

type SutTypes = {
  sut: BcryptAdapter
  salt: number
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash')
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const makeSut = (): SutTypes => {
  const salt = 12
  return {
    sut: new BcryptAdapter(salt),
    salt
  }
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct value', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('Should return a hash on success', async () => {
      const { sut } = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })
    test('Should throws if hash throw', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('compare()', () => {
    test('Should call compare with correct value', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
    test('Should return true when compare succeeds', async () => {
      const { sut } = makeSut()
      const res = await sut.compare('any_value', 'any_hash')
      expect(res).toBe(true)
    })
    test('Should return false when compare fails', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
      const res = await sut.compare('any_value', 'any_hash')
      expect(res).toBe(false)
    })

    test('Should throws if compare throw', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
