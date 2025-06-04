/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import CarsController from '#controllers/cars_controller'
import ClientsController from '#controllers/clients_controller'
import RentsController from '#controllers/rents_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'

router
  .group(() => {
    router.resource('cars', CarsController)
    router.resource('clients', ClientsController)
    router.resource('rents', RentsController)
    router.resource('users', UsersController)
    router.get('/roles', [UsersController, 'roles']).as('users.roles')
  })
  .prefix('/api')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.post('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
    router.get('/me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
  })
  .prefix('/api')
