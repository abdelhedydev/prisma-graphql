import getUserId from '../utilis/getUserId'
import { get } from 'lodash'
const Query = {
  user: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    return prisma.query.user({ where: { id: userId } }, info)
  },
  users: (parent, { first, skip }, { prisma }, info) => prisma.query.users({ first, skip }, info),
  post: async (parent, { id }, { prisma, request }, info) => {
    const userId = getUserId(request, false)
    const posts = await prisma.query.posts({
      where: {
        id,
        OR: [
          {
            published: true
          },
          {
            author: {
              id: userId
            }
          }]
      }
    }, info)
    return get(posts, '0', [])
  },
  posts: (parent, { first, skip }, { prisma }, info) => {
    const opArgs = {
      where: {
        published: true
      },
      first,
      skip
    }
    return prisma.query.posts(opArgs, info)
  },
  comment: (parent, { id }, { prisma }, info) => prisma.query.comment({ where: { id } }, info),
  comments: (parent, args, { prisma }, info) => prisma.query.comments(null, info),
  myPosts: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)
    return prisma.query.posts({ where: { author: { id: userId } } }, null)
  }
}
export { Query as default }
