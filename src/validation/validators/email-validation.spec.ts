import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'
import { mockEmailValidator } from '../test'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const mockRequest = (): any => {
  return { email: 'any_email@mail.com' }
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

    const httpRequest = mockRequest()

    const error = sut.validate(httpRequest)
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = mockSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = mockRequest()

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
