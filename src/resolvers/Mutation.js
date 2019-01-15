import bcrypt from 'bcryptjs'
import hashPassword from '../utilis/hashPassword'
import getUserId from '../utilis/getUserId'
import generateToken from '../utilis/generateToken'

const Mutattion = {
  login: async (parent, { email, password }, { prisma }, info) => {
    const userExist = await prisma.exists.User({ email })
    if (!userExist) throw new Error('User does not exist')
    const user = await prisma.query.user({ where: { email } })
    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) throw new Error('Password does not match')
    const token = generateToken(user.id)
    return {
      user, token
    }
  },
  createUser: async (parent, { data }, { prisma }, info) => {
    const password = await hashPassword(data.password)
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    })
    const token = generateToken(user.id)
    return { user, token }
  },
  updateUser: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    if (data.password) {
      data.password = await hashPassword(data.password)
    }
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
  updatePost: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExist = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })
    if (!postExist) throw new Error('Unable to Update Post')
    const post = await prisma.mutation.updatePost({
      where: {
        id
      },
      data
    }, info)
    return post
  },
  deletePost: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const postExist = prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })
    if (!postExist) throw new Error('Unable to delete Post')

    const deletedPost = await prisma.mutation.deletePost({
      where: { id }
    }, info)
    return deletedPost
  },
  createComment: async (parent, { data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const comment = await prisma.mutation.createComment({
      data: {
        ...data,
        author: {
          connect: { id: userId }
        },
        post: {
          connect: { id: data.post }
        }
      }
    }, info)
    return comment
  },
  updateComment: async (parent, { id, data }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const commentExist = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })
    if (!commentExist) throw new Error('Unable to Update This Comment')
    const comment = await prisma.mutation.updateComment({
      data: {
        ...data
      },
      where: { id }
    }, info)
    return comment
  },
  deleteComment: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request)
    const commentExist = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })
    if (!commentExist) throw new Error('Unable to delete comment')
    const comment = await prisma.mutation.deleteComment({
      where: { id }
    }, info)
    return comment
  }
}
export { Mutattion as default }
