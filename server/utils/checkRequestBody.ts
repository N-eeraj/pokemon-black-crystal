export default function checkRequestBody(body: any) {
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { errors: { body: 'Body is required' } },
    })
  }
}
