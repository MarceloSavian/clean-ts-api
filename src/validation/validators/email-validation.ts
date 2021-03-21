import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export class EmailValidation implements Validation {
  constructor (private readonly emailValidator: EmailValidatorAdapter, private readonly fieldName: string) { }

  validate (input: any): Error | null {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
