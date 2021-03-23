import { Decrypter } from '../protocols/criptography/decrypter'
import { Encrypter } from '../protocols/criptography/encrypter'
import { HashCompare } from '../protocols/criptography/hash-comparer'
import { Hasher } from '../protocols/criptography/hasher'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (): Promise<string | object | null> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

export const mockHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}
