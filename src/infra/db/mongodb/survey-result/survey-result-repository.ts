import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { ObjectID } from 'bson'
import { mongoHelper } from '../helpers/mongo-helper'
import { QueryBuilder } from '../helpers/query-builder'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await mongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectID(surveyResultData.surveyId),
      accountId: new ObjectID(surveyResultData.accountId)
    },
    { $set: surveyResultData },
    {
      upsert: true
    })
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await mongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectID(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$_id.answer'
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: ['$count', '$_id.total']
            },
            100
          ]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      })
      .project({
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })

    const surveyResult = await surveyResultCollection.aggregate(query.build()).toArray()
    return surveyResult?.[0]
  }
}
