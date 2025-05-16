import type { HttpContext } from '@adonisjs/core/http'
import Car from '#models/car'
import { CreateCarValidator, UpdateCarValidator } from '#validators/car'
import { errors } from '@vinejs/vine'

export default class CarsController {
  async index({ request, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['car_manage', 'car_show'])) {
      return {}
    }

    return await Car.query()
      .where('deleted', false)
      .paginate(request.input('page', 1), request.input('limit', 10))
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['car_manage', 'car_create'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      const payload = await request.validateUsing(CreateCarValidator)
      await Car.create(payload)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Criado com sucesso' })
  }

  async show({ params, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['car_manage', 'car_show'])) {
      return {}
    }
    return await Car.findOrFail(params.id)
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['car_manage', 'car_edit'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      const payload = await request.validateUsing(UpdateCarValidator)
      const car = await Car.findOrFail(params.id)
      await car.merge(payload).save()
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Editado com sucesso' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['car_manage', 'car_delete'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      await Car.query().where('id', params.id).update({ deleted: true })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }

    return response.status(200).json({ message: 'Deletado com sucesso' })
  }
}
