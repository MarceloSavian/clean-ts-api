import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

interface SutInterface {
  sut: AccountMongoRepository
}

const makeSut = (): SutInterface => {
  return {
    sut: new AccountMongoRepository()
  }
}

describe('Account Mongo Repository', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('add()', () => {
    test('Should return an add account on success', async () => {
      const { sut } = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail Success', async () => {
      const { sut } = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })
    test('Should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on UpdateAccessToken success', async () => {
      const { sut } = makeSut()
      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(result.ops[0]?.accessToken).toBeFalsy()
      const id = result.ops[0]._id
      await sut.updateAccessToken(id, 'any_token')
      const account = await accountCollection.findOne({ _id: result.ops[0]._id })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBeTruthy()
    })
  })
})
