import bscrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { size } from 'lodash'
import getUserId from '../utilis/getUserId'

const Mutattion = {
  login: async (parent, { email, password }, { prisma }, info) => {
    const userExist = await prisma.exists.User({ email })
    if (!userExist) throw new Error('User does not exist')
    const user = await prisma.query.user({ where: { email } })
    const passMatch = await bscrypt.compare(password, user.password)
    if (!passMatch) throw new Error('Password does not match')
    const token = jwt.sign({ userId: user.id }, 'secret')
    return {
      user, token
    }
  },
  createUser: async (parent, { data }, { prisma }, info) => {
    if (size(data.password) < 8) throw new Error('Password Must be contain more than 8 charactersF')
    const password = await bscrypt.hash(data.password, 10)
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    })
    const token = jwt.sign({ userId: user.id }, 'secret')
    return { user, token }
  },
  updateUser: (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    return prisma.mutation.updateUser({ data, where: { id: userId } }, info)
  },
  deleteUser: (parent, args, { prisma, request }, info) => prisma.mutation.deleteUser({ where: { id: getUserId(request) } }, info),
  createPost: async (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)

    const post = await prisma.mutation.createPost({
      data: {
        ...data,
        author: {
          connect: { id: userId }
        }
      }
    }, info)
    return post
  },
  updatePost: async (parent, { id, data }, { prisma }, info) => {
    const post = await prisma.mutation.updatePost({
      where: {
        id
      },
      data
    }, info)
    return post
  },
  deletePost: async (parent, { id }, { prisma }, info) => {
    const deletedPost = await prisma.mutation.deletePost({
      where: { id }
    }, info)
    return deletedPost
  },
  createComment: async (parent, { data }, { prisma }, info) => {
    const comment = await prisma.mutation.createComment({
      data: {
        ...data,
        author: {
          connect: { id: data.author }
        },
        post: {
          connect: { id: data.post }
        }
      }
    }, info)
    return comment
  },
  updateComment: async (parent, { id, data }, { prisma }, info) => {
    const comment = await prisma.mutation.updateComment({
      data: {
        ...data
      },
      where: { id }
    }, info)
    return comment
  },
  deleteComment: async (parent, { id }, { prisma }, info) => {
    const comment = await prisma.mutation.deleteComment({
      where: { id }
    }, info)
    return comment
  }
}
export { Mutattion as default }
