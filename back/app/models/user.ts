import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare active: boolean

  @column()
  declare deleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
  })
  declare roles: ManyToMany<typeof Role>

  async isAdmin(): Promise<boolean> {
    if (!this.$preloaded.roles) {
      await this.load('roles' as any)
    }

    return this.roles?.some((role) => role.name === 'admin') ?? false
  }

  async hasRole(roleName: string): Promise<boolean> {
    if (!this.$preloaded.roles) {
      await this.load('roles' as any)
    }

    if (await this.isAdmin()) {
      return true
    }

    return this.roles?.some((role) => role.role === roleName) ?? false
  }

  async hasAnyRole(roleNames: string[]): Promise<boolean> {
    if (!this.$preloaded.roles) {
      await this.load('roles' as any)
    }

    if (await this.isAdmin()) {
      return true
    }

    const roleSet = new Set(roleNames)
    return this.roles?.some((role) => roleSet.has(role.role)) ?? false
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
