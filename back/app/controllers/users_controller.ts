import Role from '#models/role'
import User from '#models/user'
import { CreateUserValidator, UpdateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class UsersController {
  async index({ request, auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return {}
    }

    return await User.query()
      .where('deleted', false)
      .paginate(request.input('page', 1), request.input('limit', 10))
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return response.status(400).json({ message: 'Usuario nao possui permissão' })
    }

    try {
      const payload = await request.validateUsing(CreateUserValidator)
      const user = await User.create(payload)
      if (request.body().roles) {
        await user.related('roles').sync(request.body().roles)
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Criado com sucesso' })
  }

  async show({ params, auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return {}
    }

    const user = await User.query().preload('roles').where('id', params.id).firstOrFail()

    const userJSON = user.toJSON()

    return {
      ...userJSON,
      roles: userJSON.roles.map((role: any) => role.id),
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return response.status(400).json({ message: 'Usuario nao possui permissão' })
    }

    try {
      const payload = await request.validateUsing(UpdateUserValidator)
      const user = await User.findOrFail(params.id)
      await user.merge(payload).save()
      if (request.body().roles) {
        await user.related('roles').sync(request.body().roles)
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Editado com sucesso' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return response.status(400).json({ message: 'Usuario nao possui permissão' })
    }

    try {
      await User.query().where('id', params.id).update({ deleted: true })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }

    return response.status(200).json({ message: 'Deletado com sucesso' })
  }

  async roles({ auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return {}
    }

    return await Role.query().paginate(1, 10)
  }
}
