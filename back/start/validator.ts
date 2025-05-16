import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'O campo {{field}} é obrigatorio',
  'unique': 'O campo {{field}} encontra-se em uso',
  'email': 'O campo {{field}} deve ser um email valido',
  'minLength': 'O campo {{field}} deve ter pelo menos {{min}} caracteres',
  'maxLength': 'O campo {{field}} deve ter no maximo {{max}} caracteres',
  'string': 'O campo {{field}} deve ser uma string',
  'number': 'O campo {{field}} deve ser um numero',

  'manufacturer.required': 'O campo Fabricante é obrigatorio',
  'color.required': 'O campo Cor é obrigatorio',
  'licensePlate.required': 'O campo Placa é obrigatorio',
  'email.unique': 'Email ja cadastrado',
})
