export const handler = async (event: any) => {
  console.log('Evento recebido:', event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Olá do Lambda com Node.js 20.x!' }),
  };
};