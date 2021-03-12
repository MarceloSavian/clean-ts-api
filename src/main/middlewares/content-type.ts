import { Response, Request, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export const contentType = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}
