import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Car from '#models/car'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'

export default class Rent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare carId: number

  @column()
  declare clientId: number

  @column()
  declare startDate: Date

  @column()
  declare endDate: Date

  @column()
  declare active: boolean

  @column()
  declare deleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Car)
  declare car: BelongsTo<typeof Car>

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>
}
