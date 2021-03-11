import { mongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

interface SutInterface {
  sut: AccountMongoRepository
}

const makeSut = (): SutInterface => {
  return {
    sut: new AccountMongoRepository()
  }
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(String(process.env.MONGO_URL))
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  test('Should retun an account on success', async () => {
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
