import vine from '@vinejs/vine'

export const CreateCarValidator = vine.compile(
  vine.object({
    manufacturer: vine.string(),
    color: vine.string(),
    licensePlate: vine.string().unique({ table: 'cars', column: 'license_plate' }),
    chassi: vine.number().unique({ table: 'cars', column: 'chassi' }),
    active: vine.boolean().optional(),
    deleted: vine.boolean().optional(),
  })
)

export const UpdateCarValidator = vine.compile(
  vine.object({
    manufacturer: vine.string().optional(),
    color: vine.string().optional(),
    licensePlate: vine.string().optional(),
    chassi: vine.number().optional(),
    active: vine.boolean().optional(),
    deleted: vine.boolean().optional(),
  })
)
