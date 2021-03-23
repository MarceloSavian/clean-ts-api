import { loginPath } from './paths/login-paths'
import { accountSchema } from './schemas/account-schema'
import { loginSchema } from './schemas/login-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'API from Mango curse to realize surveys',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    'login-params': loginSchema
  }
}
