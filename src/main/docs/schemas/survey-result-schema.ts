export const surveyResultSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    surveyId: {
      type: 'string'
    },
    date: {
      type: 'string'
    }
  }
}
