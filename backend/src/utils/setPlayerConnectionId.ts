import createHttpError from 'http-errors';
import * as redis from 'redis';


export async function setPlayerConnectionId(playerId: string, connectionId: string, client: ReturnType<typeof redis.createClient>) {

  if(!playerId) {
    throw new createHttpError.BadRequest('Connection ID cannot be null');
  }

  client.set(playerId, connectionId); 
}