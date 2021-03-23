import { EmailValidator } from '@/presentation/controllers/auth/login/login-controller-protocols'

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
