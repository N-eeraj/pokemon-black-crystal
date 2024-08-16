import { z } from 'zod'

export default function handleValidationErrors(error: any) {
  if (error instanceof z.ZodError) {
    const errors = Object.fromEntries(error.issues.map(({ path, message }) => [path[0], message]))
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid Data',
      data: { errors },
    })
  }
}
