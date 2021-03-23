import { LogErrorRepository } from '../protocols/db/log/log-error-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}
