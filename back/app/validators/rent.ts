import vine from '@vinejs/vine'

export const CreateRentValidator = vine.compile(
  vine.object({
    carId: vine.number(),
    clientId: vine.number(),
    dateRange: vine.array(vine.string()),
  })
)

export const UpdateRentValidator = vine.compile(
  vine.object({
    carId: vine.number().optional(),
    clientId: vine.number().optional(),
    dateRange: vine.array(vine.string()).optional(),
  })
)
