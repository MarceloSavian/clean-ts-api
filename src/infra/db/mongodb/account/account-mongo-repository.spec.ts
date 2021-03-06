import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { mockAccountParams } from '@/domain/test/mock-account'

type SutTypes = {
  sut: AccountMongoRepository
}

const mockSut = (): SutTypes => {
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
      const { sut } = mockSut()
      const account = await sut.add(mockAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAccountParams().name)
      expect(account.email).toBe(mockAccountParams().email)
      expect(account.password).toBe(mockAccountParams().password)
    })
  })
  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail Success', async () => {
      const { sut } = mockSut()
      await accountCollection.insertOne(mockAccountParams())
      const account = await sut.loadByEmail(mockAccountParams().email)
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(mockAccountParams().name)
      expect(account?.email).toBe(mockAccountParams().email)
      expect(account?.password).toBe(mockAccountParams().password)
    })
    test('Should return null if loadByEmail fails', async () => {
      const { sut } = mockSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on UpdateAccessToken success', async () => {
      const { sut } = mockSut()
      const result = await accountCollection.insertOne(mockAccountParams())
      expect(result.ops[0]?.accessToken).toBeFalsy()
      const id = result.ops[0]._id
      await sut.updateAccessToken(id, 'any_token')
      const account = await accountCollection.findOne({ _id: result.ops[0]._id })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBeTruthy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should return an account on loadByToken without role Success', async () => {
      const { sut } = mockSut()
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(mockAccountParams().name)
      expect(account?.email).toBe(mockAccountParams().email)
      expect(account?.password).toBe(mockAccountParams().password)
    })
    test('Should return an account on loadByToken with role Success', async () => {
      const { sut } = mockSut()
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(mockAccountParams().name)
      expect(account?.email).toBe(mockAccountParams().email)
      expect(account?.password).toBe(mockAccountParams().password)
    })
    test('Should return an account on loadByToken if user is admin', async () => {
      const { sut } = mockSut()
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe(mockAccountParams().name)
      expect(account?.email).toBe(mockAccountParams().email)
      expect(account?.password).toBe(mockAccountParams().password)
    })
    test('Should return null on loadByToken with invalid role', async () => {
      const { sut } = mockSut()
      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })
    test('Should return null if loadByToken fails', async () => {
      const { sut } = mockSut()
      const account = await sut.loadByToken('any_email@mail.com', 'any_role')
      expect(account).toBeFalsy()
    })
  })
})
