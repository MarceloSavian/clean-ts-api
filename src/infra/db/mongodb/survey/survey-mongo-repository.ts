import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols'
import { mongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<null> {
    const accountCollection = await mongoHelper.getCollection('surveys')
    await accountCollection.insertOne(surveyData)

    return null
  }
}
