const Mutattion = {
  createUser: (parent, { data }, { prisma }, info) => prisma.mutation.createUser({ data }, info),
  updateUser: (parent, { id, data }, { prisma }, info) => prisma.mutation.updateUser({ data, where: { id } }, info),
  deleteUser: (parent, { id }, { prisma }, info) => prisma.mutation.deleteUser({ where: { id } }, info),
  createPost: async (parent, { data }, { prisma, pubsub }, info) => {
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
    if (post) {
      pubsub.publish('Post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }
    return post
  },
  updatePost: async (parent, { id, data }, { prisma, pubsub }, info) => {
    const postExist = prisma.exists.Post({ id })
    if (!postExist) throw new Error('Post does not exist')
    const post = await prisma.mutation.updatePost({
      where: {
        id
      },
      data
    }, info)
    pubsub.publish('Post', {
      post: {
        mutation: 'UPDATED',
        data: post
      }
    })
    return post
  },
  deletePost: (parent, { id }, { prisma, pubsub }, info) => {
    const deletedPost = prisma.mutation.deletePost({
      where: { id }
    }, info)
    pubsub.publish('Post', {
      post: {
        mutation: 'DELETED',
        data: deletedPost
      }
    })
    return deletedPost
  },
  createComment: (parent, { data }, { prisma, pubsub }, info) => {
    // const userExist = prisma.exists.User({ id: data.author })
    // if (!userExist) throw new Error('User does not exist')
    // const postExist = prisma.exists.Post({ id: data.post })
    // if (!postExist) throw new Error('Post does not exist')
    // const comment = prisma.mutation.createComment({
    //   data :{
    //     ...data,
    //   }
    // })
    // pubsub.publish('Comment', {
    //   comment: {
    //     mutation: 'CREATED',
    //     data: comment
    //   }
    // })
    // return comment
  },
  deleteComment: (parent, args, { db: { comments }, pubsub }, info) => {
    const commentIndex = comments.findIndex(comment => comment.id === args.id)
    if (commentIndex === -1) throw new Error('comment does not exist !!')
    const [deletedComment] = comments.splice(commentIndex, 1)
    pubsub.publish('Comment', {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    })
    return deletedComment
  },
  updateComment: (parent, { id, data }, { db, pubsub }, info) => {
    const comment = db.comments.find(com => com.id === id)
    if (!comment) throw new Error('Comment Not found')
    if (data.text) {
      comment.text = data.text
    }
    pubsub.publish('Comment', {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })
    return comment
  }
}
export { Mutattion as default }
