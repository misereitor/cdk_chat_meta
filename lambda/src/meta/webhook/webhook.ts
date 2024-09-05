import { APIGatewayProxyResult } from 'aws-lambda';
import { handleGetRequest, handlePostRequest } from './webhookService';

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  if (method === 'POST') {
    return handlePostRequest(event);
  } else if (method === 'GET') {
    return handleGetRequest(event);
  } else {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: `Método ${event} não permitido`
      })
    };
  }
};
