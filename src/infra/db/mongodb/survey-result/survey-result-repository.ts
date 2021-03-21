import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { mongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await mongoHelper.getCollection('surveyResults')
    const result = await surveyResultCollection.findOneAndUpdate({
      surveyId: surveyResultData.surveyId,
      accountId: surveyResultData.accountId
    },
    { $set: surveyResultData },
    {
      upsert: true,
      returnOriginal: false
    })

    return result.value && mongoHelper.map(result.value)
  }
}
