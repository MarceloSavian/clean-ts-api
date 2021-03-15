import { EmailValidatorAdapter } from '../../../main/adapters/validators/email-validator-adapter'
import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  constructor (private readonly emailValidator: EmailValidatorAdapter, private readonly fieldName: string) { }

  validate (input: any): Error | null {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
