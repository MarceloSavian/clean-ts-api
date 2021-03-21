import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

type SutTypes = {
  sut: CompareFieldsValidation
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
  return {
    sut
  }
}

describe('Required field validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const { sut } = makeSut()

    const err = sut.validate({ password: '123', passwordConfirmation: '1234' })
    expect(err).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('Should return null if validation succeds', () => {
    const { sut } = makeSut()

    const res = sut.validate({ password: '123', passwordConfirmation: '123' })
    expect(res).toBeFalsy()
  })
})
