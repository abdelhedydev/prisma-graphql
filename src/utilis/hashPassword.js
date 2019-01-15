import bcrypt from 'bcryptjs'
import { size } from 'lodash'

const hashPassword = (password) => {
  if (size(password) < 8) throw new Error('Password Must be contain more than 8 charactersF')
  return bcrypt.hash(password, 10)
}
export { hashPassword as default }
