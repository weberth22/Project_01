import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Rent from '#models/rent'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare manufacturer: string

  @column()
  declare color: string

  @column()
  declare licensePlate: string

  @column()
  declare chassi: number

  @column()
  declare active: boolean

  @column()
  declare deleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Rent)
  declare rents: HasOne<typeof Rent>
}
