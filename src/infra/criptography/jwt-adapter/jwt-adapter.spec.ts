import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('any_token')
  },
  async verify (): Promise<string> {
    return Promise.resolve('any_value')
  }
}))

interface SutInterface {
  sut: JwtAdapter
  secret: string
}

const makeSut = (): SutInterface => {
  const secret = 'secret'
  const sut = new JwtAdapter('secret')

  return {
    sut,
    secret
  }
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call Jwt sign with correct values', async () => {
      const { sut, secret } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
    })
    test('Should return a token on sign success', async () => {
      const { sut } = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
    test('Should throw if sign thorws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('verify()', () => {
    test('Should call Jwt verify with correct values', async () => {
      const { sut, secret } = makeSut()
      const signSpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(signSpy).toHaveBeenCalledWith('any_token', secret)
    })
    test('Should return a value on verify success', async () => {
      const { sut } = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
    test('Should throw if verify thorws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
