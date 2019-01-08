const Query = {
  me: () => ({ id: '54df5g4d5fg4d5f4gdfg', name: 'abdelhedi', email: 'sjkjdfnksdf', age: 15 }),
  Post: () => ({ id: '1245dsd45dfgsdf', title: 'Article title', body: 'This is tje content of the Article' }),
  posts: (_, { query }, { db }) => query ? db.posts.filter(post => post.title.toLowerCase().includes(query) || post.body.includes(query)) : db.posts,
  users: (_, $, { db }) => db.users,
  comments: (_, $, { db }) => db.comments
}
export { Query as default }
