import { loginPath } from './paths/login-paths'
import { accountSchema, loginSchema, errorSchema } from './schemas/'
import { badRequest, serverError, unauthorized } from './components/'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'API from Mango curse to realize surveys',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
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
    'login-params': loginSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorized
  }
}
