import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('manufacturer').notNullable()
      table.string('color').notNullable()
      table.string('license_plate').notNullable().unique()
      table.integer('chassi').notNullable().unique()
      table.boolean('active').defaultTo(false)
      table.boolean('deleted').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}