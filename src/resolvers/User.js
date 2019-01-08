const User = {
  posts: (parent, args, { db }, info) => db.posts.filter((post) => post.author === parent.id),
  comments: (parent, args, { db }, info) => db.comments.filter((comment) => comment.author === parent.id)
}
export { User as default }
