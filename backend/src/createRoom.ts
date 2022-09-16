import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client'
import { checkAuth } from './utils/checkAuth';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import { validateEventSchema } from './utils/validateEventSchema';
import Joi from 'joi';
import { createRoomCore } from './utils/createRoomCore';
const prisma = new PrismaClient()

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

 
  var x = event.body as any;
 
  var x = JSON.parse(x||'{}');
  const { playerId, name, title } = x;
  console.log(playerId);
  const {room, token,player} = await createRoomCore(playerId, name, title, prisma);

  await prisma.$disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify({
      room,
      token,
      player
    })
  }
})

handler
  .use(httpJsonBodyParser())
 

  .use(httpErrorHandler())
  .use(cors({
    origin: process.env.ALLOWED_ORIGIN
  }))
