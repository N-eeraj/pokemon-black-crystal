export default defineEventHandler((event) => {
  throw createError({
    statusCode: 404,
    statusMessage: 'URL not found',
  })
})
