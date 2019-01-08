const Subscription = {
  count: {
    subscribe: (parent, args, { pubsub }) => {
      let count = 0
      setInterval(() => {
        count++
        pubsub.publish('Counter', { count })
      }, 1000)
      return pubsub.asyncIterator('Counter')
    }
  },
  comment: {
    subscribe: (parent, args, { pubsub }, info) => pubsub.asyncIterator('Comment')
  },
  post: {
    subscribe: (parent, ags, { pubsub }, info) => pubsub.asyncIterator('Post')
  }
}
export { Subscription as default }
