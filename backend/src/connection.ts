import middy, { MiddlewareObj } from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as redis from 'redis';
import { setPlayerConnectionId } from './utils/setPlayerConnectionId';

const client = redis.createClient({
  socket:{
  host: process.env.REDIS_URL,
  port: 6379,
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then((e)=>{
  console.log(e);
  console.log("Success");
});
let handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
//console.log(event);

  const { connectionId, routeKey } = event.requestContext;
  const { playerId } = event.body as any;

  switch(routeKey) {
    case '$connect':
      setPlayerConnectionId(playerId, connectionId!, client);
      break;
    case '$disconnect':
      // unsetPlayer socket data
    case '$default':
      console.log('Default socket event triggered');
      
  }

  return {
    statusCode: 200,
    body: 'Hello',
  }
})

handler
  .use(
    httpJsonBodyParser()
  )
module.exports.handler = handler
