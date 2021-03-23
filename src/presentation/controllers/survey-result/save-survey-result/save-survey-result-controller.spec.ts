import { HttpRequest, LoadSurveyById, SurveyModel, forbidden, InvalidParamError } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'
import { mockSaveSurveyResultParams, mockSurveyModel, mockSurveyResultModel } from '@/domain/test'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const mockFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: mockSaveSurveyResultParams().surveyId
  },
  body: {
    ...mockSaveSurveyResultParams()
  },
  accountId: mockSaveSurveyResultParams().accountId
})

const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultStub()
}

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

const mockSut = (): SutTypes => {
  const saveSurveyResultStub = mockSaveSurveyResult()
  const loadSurveyByIdStub = mockLoadSurveyById()
  return {
    sut: new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub),
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = mockSut()
    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockFakeRequest().params.surveyId)
  })
  test('Should return 403 if LoadSurveyById returns null ', async () => {
    const { sut, loadSurveyByIdStub } = mockSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if LoadSurveyById returns throws ', async () => {
    const { sut, loadSurveyByIdStub } = mockSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = mockSut()
    const httpRequest = {
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = mockSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockFakeRequest())
    expect(saveSpy).toBeCalledWith(mockSaveSurveyResultParams())
  })
  test('Should return 500 if SaveSurveyResult returns throws ', async () => {
    const { sut, saveSurveyResultStub } = mockSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = mockSut()
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
