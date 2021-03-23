import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/presentation/controllers/auth/login/login-controller-protocols'

export const mockAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  ...mockAccountParams()
})

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
