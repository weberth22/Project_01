import type { HttpContext } from '@adonisjs/core/http'

export default class AuthCookie {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    const token = request.cookie('auth_token')

    if (token) {
      request.headers().authorization = `Bearer ${token}`
    }

    await next()
  }
}
