const Post = {
  author: (parent, args, { db }, info) => db.users.find((user) => user.id === parent.author),
  comments: (parent, args, { db }, info) => db.comments.filter((comment) => comment.post === parent.id)
}
export { Post as default }
