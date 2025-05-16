import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.verifyCredentials(email, password)

      const token = await User.accessTokens.create(user)

      return response.ok({ token })
    } catch (error) {
      return response.status(400).json({
        message: 'Credenciais inválidas',
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      if ('currentAccessToken' in user) {
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      }

      return response.status(200).json({ message: 'Deslogado com sucesso' })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao deslogar',
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    try {
      await auth.check()

      return response.ok(auth.user)
    } catch {
      return response.status(400).json({ message: 'Usuário não autenticado' })
    }
  }
}
