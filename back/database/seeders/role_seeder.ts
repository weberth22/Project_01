import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.create({
      role: 'admin',
      name: 'Administrador',
    })

    await Role.create({
      role: 'car_manage',
      name: 'Gerenciar Carros',
    })

    await Role.create({
      role: 'car_create',
      name: 'Cadastrar Carros',
    })

    await Role.create({
      role: 'car_show',
      name: 'Visualizar Carros',
    })

    await Role.create({
      role: 'car_edit',
      name: 'Editar Carros',
    })

    await Role.create({
      role: 'car_delete',
      name: 'Deletar Carros',
    })

    await Role.create({
      role: 'client_manage',
      name: 'Gerenciar Clientes',
    })

    await Role.create({
      role: 'client_create',
      name: 'Cadastrar Clientes',
    })

    await Role.create({
      role: 'client_show',
      name: 'Visualizar Clientes',
    })

    await Role.create({
      role: 'client_edit',
      name: 'Editar Clientes',
    })

    await Role.create({
      role: 'client_delete',
      name: 'Deletar Clientes',
    })

    await Role.create({
      role: 'rental_manage',
      name: 'Gerenciar Alugueis',
    })

    await Role.create({
      role: 'rental_create',
      name: 'Cadastrar Alugueis',
    })

    await Role.create({
      role: 'rental_show',
      name: 'Visualizar Alugueis',
    })

    await Role.create({
      role: 'rental_edit',
      name: 'Editar Alugueis',
    })

    await Role.create({
      role: 'rental_delete',
      name: 'Deletar Alugueis',
    })
  }
}
