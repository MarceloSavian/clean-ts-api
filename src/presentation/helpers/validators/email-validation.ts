import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidatorAdapter
  private readonly fieldName: string

  constructor (emailValidator: EmailValidatorAdapter, fieldName: string) {
    this.emailValidator = emailValidator
    this.fieldName = fieldName
  }

  validate (input: any): Error | null {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
