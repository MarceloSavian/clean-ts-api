import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { mockValidation } from '../test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  validations: Validation[]
}

const makeSut = (): SutTypes => {
  const validations = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validations)
  return {
    sut,
    validations
  }
}

describe('Required field validation', () => {
  test('Should return an error if validation fails', () => {
    const { sut, validations } = makeSut()
    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new Error())
    const err = sut.validate({})
    expect(err).toEqual(new Error())
  })
  test('Should return the first error if more than one validation fails', () => {
    const { sut, validations } = makeSut()
    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new MissingParamError('name'))
    const err = sut.validate({})
    expect(err).toEqual(new Error())
  })
  test('Should return null if validation succeds', () => {
    const { sut } = makeSut()

    const res = sut.validate({ name: 'any_name' })
    expect(res).toBeFalsy()
  })
})
