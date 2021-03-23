export const surveyPath = {
  get: {
    tags: ['Surveys'],
    summary: 'List all surveys',
    security: [{
      apiKeyAuth: []
    }],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/unauthorized'
      }
    }
  },
  post: {
    tags: ['Surveys'],
    summary: 'Create surveys',
    security: [{
      apiKeyAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/unauthorized'
      }
    }
  }
}
