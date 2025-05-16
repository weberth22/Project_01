import Rent from '#models/rent'
import { CreateRentValidator, UpdateRentValidator } from '#validators/rent'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class RentsController {
  async index({ request, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['rent_manage', 'rent_show'])) {
      return {}
    }

    return await Rent.query()
      .where('deleted', false)
      .preload('car')
      .preload('client')
      .paginate(request.input('page', 1), request.input('limit', 10))
  }

  async store({ request, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['rent_manage', 'rent_create'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      const payload = await request.validateUsing(CreateRentValidator)
      const payloadToSave = {
        ...payload,
        startDate: new Date(payload.dateRange[0]),
        endDate: new Date(payload.dateRange[1]),
      }

      if (payloadToSave.startDate > payloadToSave.endDate) {
        return response
          .status(400)
          .json({ message: 'Incio do aluguel deve ser anterior ao fim do aluguel' })
      }

      await Rent.create(payloadToSave)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Criado com sucesso' })
  }

  async show({ params, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['rent_manage', 'rent_show'])) {
      return {}
    }

    const rent = await Rent.query()
      .where('id', params.id)
      .preload('car')
      .preload('client')
      .firstOrFail()

    const rentJSON = rent.toJSON()

    return {
      ...rentJSON,
      dateRange: [rent.startDate, rent.endDate],
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['rent_manage', 'rent_edit'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      const payload = await request.validateUsing(UpdateRentValidator)
      const payloadToSave: Partial<Rent> = {
        ...payload,
      }

      if (payload.dateRange) {
        payloadToSave.startDate = new Date(payload.dateRange[0])
        payloadToSave.endDate = new Date(payload.dateRange[1])

        if (payloadToSave.startDate > payloadToSave.endDate) {
          return response
            .status(400)
            .json({ message: 'Incio do aluguel deve ser anterior ao fim do aluguel' })
        }
      }

      const rent = await Rent.findByOrFail('id', params.id)
      await rent.merge(payloadToSave).save()
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({ message: error.messages })
      }
    }
    return response.status(200).json({ message: 'Editado com sucesso' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    if (!auth.user?.hasAnyRole(['rent_manage', 'rent_delete'])) {
      return response.status(400).json({ message: 'Usuario não possui permissão' })
    }

    try {
      await Rent.query().where('id', params.id).update({ deleted: true })
    } catch (error) {
      return response.status(400).json({ message: error.messages })
    }

    return response.status(200).json({ message: 'Deletado com sucesso' })
  }
}
