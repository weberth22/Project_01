import vine from '@vinejs/vine'

export const CreateClientValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email().normalizeEmail().unique({ table: 'clients', column: 'email' }),
    phone: vine.string(),
    active: vine.boolean().optional(),
    deleted: vine.boolean().optional(),
  })
)

export const UpdateClientValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().optional(),
    active: vine.boolean().optional(),
    deleted: vine.boolean().optional(),
  })
)
