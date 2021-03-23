import { loginPath, surveyPath, signUpPath } from './paths/'
import {
  accountSchema,
  loginSchema,
  errorSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  apiKeyAuthSchema,
  signUpParamsSchema,
  addSurveyParamsSchema
} from './schemas/'
import { badRequest, serverError, unauthorized, forbidden } from './components/'

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
  }, {
    name: 'Surveys'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
    '/signup': signUpPath
  },
  schemas: {
    account: accountSchema,
    'login-params': loginSchema,
    error: errorSchema,
    survey: surveySchema,
    addSurveyParams: addSurveyParamsSchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    signUpParams: signUpParamsSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    forbidden
  }
}
