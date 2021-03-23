export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'User authentication',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login-params'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: 'Bad Request'
      }
    }
  }
}
