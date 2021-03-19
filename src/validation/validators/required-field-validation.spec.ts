import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

interface SutInterface {
  sut: RequiredFieldValidation
}

const makeSut = (): SutInterface => {
  const sut = new RequiredFieldValidation('name')
  return {
    sut
  }
}

describe('Required field validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const { sut } = makeSut()

    const err = sut.validate({})
    expect(err).toEqual(new MissingParamError('name'))
  })
  test('Should return null if validation succeds', () => {
    const { sut } = makeSut()

    const res = sut.validate({ name: 'any_name' })
    expect(res).toBeFalsy()
  })
})
