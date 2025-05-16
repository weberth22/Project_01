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
      await User.create(payload)
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

    return await User.findOrFail(params.id)
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (!auth.user?.isAdmin()) {
      return response.status(400).json({ message: 'Usuario nao possui permissão' })
    }

    try {
      const payload = await request.validateUsing(UpdateUserValidator)
      const user = await User.findOrFail(params.id)
      await user.merge(payload).save()
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
}
