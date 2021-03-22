import { LoadSurveysByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { AddSurveyModel, AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { mongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveysByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<null> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)

    return null
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return mongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: id })
    return survey && mongoHelper.map(survey)
  }
}
