import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeFakeRequest = (): any => {
  return { email: 'any_email@mail.com' }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub, 'email')
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeRequest()

    await sut.validate(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should return throws if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
