import jwt from 'jsonwebtoken'
const generateToken = (userId) => jwt.sign({ userId }, 'secret', { expiresIn: '5h' })
export { generateToken as default }
