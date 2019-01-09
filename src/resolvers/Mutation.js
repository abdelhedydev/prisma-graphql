const Mutattion = {
  createUser: (parent, { data }, { prisma }, info) => prisma.mutation.createUser({ data }, info),
  updateUser: (parent, { id, data }, { prisma }, info) => prisma.mutation.updateUser({ data, where: { id } }, info),
  deleteUser: (parent, { id }, { prisma }, info) => prisma.mutation.deleteUser({ where: { id } }, info),
  createPost: async (parent, { data }, { prisma }, info) => {
    const userExist = prisma.exists.User({ id: data.author })
    if (!userExist) throw new Error('User does not exist')
    const post = await prisma.mutation.createPost({
      data: {
        ...data,
        author: {
          connect: { id: data.author }
        }
      }
    }, info)
    return post
  },
  updatePost: async (parent, { id, data }, { prisma }, info) => {
    const postExist = prisma.exists.Post({ id })
    if (!postExist) throw new Error('Post does not exist')
    const post = await prisma.mutation.updatePost({
      where: {
        id
      },
      data
    }, info)
    return post
  },
  deletePost: (parent, { id }, { prisma }, info) => {
    const deletedPost = prisma.mutation.deletePost({
      where: { id }
    }, info)
    return deletedPost
  },
  createComment: (parent, { data }, { prisma }, info) => {
    const userExist = prisma.exists.User({ id: data.author })
    if (!userExist) throw new Error('User does not exist')
    const postExist = prisma.exists.Post({ id: data.post })
    if (!postExist) throw new Error('Post does not exist')
    const comment = prisma.mutation.createComment({
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
  updateComment: (parent, { id, data }, { prisma }, info) => {
    const commentExist = prisma.exists.Comment({ id })
    if (!commentExist) throw new Error('Comment Not found')
    const comment = prisma.mutation.updateComment({
      data: {
        ...data
      },
      where: { id }
    }, info)
    return comment
  },
  deleteComment: async (parent, { id }, { prisma }, info) => {
    const commentExist = await prisma.exists.Comment({ id })
    if (!commentExist) throw new Error('comment does not exist !!')
    const comment = await prisma.mutation.deleteComment({
      where: { id }
    }, info)
    return comment
  }
}
export { Mutattion as default }
