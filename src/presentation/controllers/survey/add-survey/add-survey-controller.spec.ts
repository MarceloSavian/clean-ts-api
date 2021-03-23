import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation, AddSurvey } from './add-surver-controller-protocols'
import MockDate from 'mockdate'
import { mockAddSurvey, mockValidation } from '@/presentation/test'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any'
    }],
    date: new Date()
  }
})

const mockSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  return {
    sut: new AddSurveyController(validationStub, addSurveyStub),
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = mockSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should retrun 400 if Validation fails', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = mockSut()
    const validateSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = mockSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut } = mockSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
