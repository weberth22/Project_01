import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RoleUser from '#models/role_user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'admin@localhost.com',
      fullName: 'Admin',
      password: 'admin',
    })

    await RoleUser.create({
      userId: 1,
      roleId: 1,
    })
  }
}
