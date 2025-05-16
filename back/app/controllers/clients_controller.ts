import Client from '#models/client'
import { CreateClientValidator, UpdateClientValidator } from '#validators/client'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class ClientsController {
  async index({ request, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['client_manage', 'client_show'])) {
      return {}
    }
    return await Client.query()
      .where('deleted', false)
      .paginate(request.input('page', 1), request.input('limit', 10))
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['client_manage', 'client_create'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      const payload = await request.validateUsing(CreateClientValidator)
      await Client.create(payload)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Criado com sucesso' })
  }

  async show({ params, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['client_manage', 'client_show'])) {
      return {}
    }
    return await Client.findOrFail(params.id)
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['client_manage', 'client_edit'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      const payload = await request.validateUsing(UpdateClientValidator)
      const client = await Client.findOrFail(params.id)
      await client.merge(payload).save()
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Editado com sucesso' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['client_manage', 'client_delete'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      await Client.query().where('id', params.id).update({ deleted: true })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }

    return response.status(200).json({ message: 'Deletado com sucesso' })
  }
}
