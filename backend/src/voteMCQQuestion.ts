import { PrismaClient } from '@prisma/client';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { checkAuth } from './utils/checkAuth';
import { validateEventSchema } from './utils/validateEventSchema';
import Joi from 'joi';
import cors from '@middy/http-cors';

const prisma = new PrismaClient();

const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  
  var x = event.body as any;
 
  var x = JSON.parse(x||'{}');
  const { playerId, questionId, optionId } = x;

  const playerAnswer = await prisma.playerAnswer.create({
    data: {
      qid: questionId,
      pid: playerId,
      mcqQuestionPlayerAnswer: {
        create: {
          answerId: optionId,
        }
      }
    }
  });


  await prisma.$disconnect();

  return {
    body: JSON.stringify({
      playerAnswer
    }),
    statusCode: 200,
  }
})

handler
  .use(httpJsonBodyParser())
 
  .use(httpErrorHandler())
  .use(cors({
    origin: process.env.ALLOWED_ORIGIN
  }))

module.exports.handler = handler;