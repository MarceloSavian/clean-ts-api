export const forbidden = {
  description: 'Forbidden Request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
