import { z } from 'zod'

const userSchema = z.object({
  email: z.string({ message: 'This field is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ message: 'This field is required' })
    .min(1, { message: 'Password can\'t be empty' }),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  checkRequestBody(body)

  try {
    const validatedData = userSchema.parse(body)
    return validatedData
  } catch(error) {
    handleValidationErrors(error)
  }
})
