const Subscription = {
  comment: {
    subscribe: (parent, args, { prisma }, info) => prisma.subscription.comment(null, info)
  },
  post: {
    subscribe: (parent, ags, { prisma }, info) => prisma.subscription.post({
      where: {
        node: {
          published: true
        }
      }
    }, info)
  },
  user: {
    subscribe: (parent, args, { prisma }, info) => prisma.subscription.user(null, info)
  }
}
export { Subscription as default }
