import { Response, Request } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export const adaptRoute = (controller: Controller): any => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode > 299) {
      return res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
