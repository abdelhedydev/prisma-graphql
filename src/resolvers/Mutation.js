const Mutattion = {
  createUser: (parent, { data }, { prisma }, info) => prisma.mutation.createUser({ data }, info),
  updateUser: (parent, { id, data }, { prisma }, info) => prisma.mutation.updateUser({ data, where: { id } }, info),
  deleteUser: (parent, { id }, { prisma }, info) => prisma.mutation.deleteUser({ where: { id } }, info),
  createPost: async (parent, { data }, { prisma }, info) => {
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
