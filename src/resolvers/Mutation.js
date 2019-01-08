import uuidv4 from 'uuid/v4'

const Mutattion = {
  createUser: (parent, args, { db }, info) => {
    const emailTaken = db.users.some(user => user.email === args.input.email)
    if (emailTaken) throw new Error('This email is already used')
    const newuser = {
      id: uuidv4(),
      ...args.input
    }
    db.users.push(newuser)
    return newuser
  },
  updateUser: (parent, args, { db }, info) => {
    const { id, data } = args
    const user = db.users.find(user => user.id === id)
    if (!user) throw new Error('User does not exist')
    if (typeof data.email === 'string') {
      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }
    if (data.age > 0) {
      user.age = data.age
    }
    return user
  },
  deleteUser: (parent, args, { db: { users, comments, posts } }, info) => {
    const user = users.find(user => user.id === args.id)
    if (user.length < 1) {
      throw new Error('Oh user does not exist')
    }
    // Removing user comments
    comments = comments.filter(comment => comment.author !== args.id)

    // Removing user posts
    posts = posts.filter((post) => {
      const match = post.author === args.id
      if (match) {
        comments = comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })

    // Removing user from users
    users = users.filter(u => u.id !== user.id)
    return user
  },
  createPost: (parent, args, { db, pubsub }, info) => {
    const userExist = db.users.some(user => user.id === args.input.author)
    if (!userExist) throw new Error('User does not exist !')
    const post = {
      id: uuidv4(),
      ...args.input
    }
    db.posts.push(post)
    pubsub.publish('Post',
      {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    return post
  },
  updatePost: (parent, args, { db, pubsub }, info) => {
    const { id, data } = args
    const post = db.posts.find(post => post.id === id)
    if (!post) throw new Error('Post does not exist')
    if (data.title) post.title = data.title
    if (data.body) post.body = data.body
    if (data.published) post.published = data.published
    pubsub.publish('Post', {
      post: {
        mutation: 'UPDATED',
        data: post
      }
    })
    return post
  },
  deletePost: (parent, args, { db, pubsub }, info) => {
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) throw new Error('Post does not exist')
    // Removing post Comments
    db.comments = db.comments.filter(comment => comment.post !== args.id)
    // Removing the Post
    const [deletedPost] = db.posts.splice(postIndex, 1)
    pubsub.publish('Post', {
      post: {
        mutation: 'DELETED',
        data: deletedPost
      }
    })
    return deletedPost
  },
  createComment: (parent, args, { db, pubsub }, info) => {
    const { users, posts, comments } = db
    const userExist = users.some(user => user.id === args.input.author)
    const postExist = posts.some(post => post.id === args.input.post)
    const isPublished = (posts.find(post => post.id === args.input.post).published)
    if (!userExist || !postExist || !isPublished) throw new Error('Input Error was founded')
    const newComment = {
      id: uuidv4(),
      ...args.input
    }
    comments.push(newComment)
    pubsub.publish('Comment', {
      comment: {
        mutation: 'CREATED',
        data: newComment
      }
    })
    return newComment
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
