import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {  PrismaClient } from '@prisma/client'
import { checkAuth } from './utils/checkAuth';
import httpErrorHandler from '@middy/http-error-handler';
import { validateEventSchema } from './utils/validateEventSchema';
import Joi from 'joi';
import { fetchAnalytics } from './utils/fetchAnalytics';
import cors from '@middy/http-cors';
const prisma = new PrismaClient()

const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  var x = event.body as any;
 
  var x = JSON.parse(x||'{}');
  const { playerId, roomId } = x;

  const analytics = await fetchAnalytics(roomId, prisma);

  await prisma.$disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify({
      analytics,
    })
  }
})

handler
  .use(httpJsonBodyParser())

  .use(httpErrorHandler())
  .use(cors({
    origin: process.env.ALLOWED_ORIGIN
  }))

module.exports.handler = handler