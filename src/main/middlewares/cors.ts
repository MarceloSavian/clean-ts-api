import { Response, Request, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  next()
}
