
const Query = {
  user: (parent, { id }, { prisma }, info) => prisma.query.user({ where: { id } }, info),
  users: (parent, args, { prisma }, info) => prisma.query.users(null, info),
  post: (parent, { id }, { prisma }, info) => prisma.query.post({ where: { id } }, info),
  posts: (parent, args, { prisma }, info) => prisma.query.posts(null, info),
  comment: (parent, { id }, { prisma }, info) => prisma.query.comment({ where: { id } }, info),
  comments: (parent, args, { prisma }, info) => prisma.query.comments(null, info)
}
export { Query as default }
