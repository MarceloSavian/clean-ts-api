import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const mockFakeRequest = (): any => {
  return { email: 'any_email@mail.com' }
}

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const mockSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = mockSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = mockFakeRequest()

    const error = sut.validate(httpRequest)
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = mockSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = mockFakeRequest()

    sut.validate(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should return throws if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = mockSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
