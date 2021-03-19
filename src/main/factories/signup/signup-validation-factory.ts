import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation, EmailValidation } from '../../../validation/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  const emailValidatorAdapter = new EmailValidatorAdapter()
  validations.push(new EmailValidation(emailValidatorAdapter, 'email'))
  return new ValidationComposite(validations)
}
