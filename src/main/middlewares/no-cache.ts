import { Response, Request, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export const noCache = (req: Request, res: Response, next: NextFunction): void => {
  res.set('cache-control', 'no-store, node-cache, must-revalidate, proxy-revalidate')
  res.set('pragma', 'no-cache')
  res.set('expires', '0')
  res.set('surrogate-control', 'no-store')
  next()
}
