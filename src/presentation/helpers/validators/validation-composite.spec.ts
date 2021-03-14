import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutInterface {
  sut: ValidationComposite
  validation: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutInterface => {
  const validation = makeValidation()
  const sut = new ValidationComposite([validation])
  return {
    sut,
    validation
  }
}

describe('Required field validation', () => {
  test('Should return an error if validation fails', () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error())
    const err = sut.validate({})
    expect(err).toEqual(new Error())
  })
  test('Should return null if validation succeds', () => {
    const { sut } = makeSut()

    const res = sut.validate({ name: 'any_name' })
    expect(res).toBeFalsy()
  })
})
