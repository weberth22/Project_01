import vine from '@vinejs/vine'

export const CreateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    email: vine.string().email().normalizeEmail().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

export const UpdateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().optional(),
    email: vine.string().email().normalizeEmail().optional(),
    password: vine
      .string()
      .minLength(8)
      .confirmed({ confirmationField: 'passwordConfirmation' })
      .optional(),
  })
)
