import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('car_id').unsigned().notNullable()
      table.integer('client_id').unsigned().notNullable()
      table.foreign('client_id').references('clients.id')
      table.foreign('car_id').references('cars.id')
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.boolean('active').defaultTo(true)
      table.boolean('deleted').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
