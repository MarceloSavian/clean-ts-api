import bcrypt from 'bcrypt'
import { HashCompare } from '@/data/protocols/criptography/hash-comparer'
import { Hasher } from '@/data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) { }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return Promise.resolve(hash)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return Promise.resolve(isValid)
  }
}
