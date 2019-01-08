let posts = [
  { id: '1', title: 'Post number 1 title ', body: 'Post number 1 body', published: true, author: '1' },
  { id: '2', title: 'Post number 2 title', body: 'Post number 2 body', published: false, author: '3' },
  { id: '3', title: 'Post number 3 title', body: 'Post number 3 body', published: true, author: '2' }
]
let users = [
  { id: '1', name: 'abdelhedi', email: 'sjkjdfnksdf', age: 15 },
  { id: '2', name: 'Mohammed', email: 'sjkjdfnksdf', age: 15 },
  { id: '3', name: 'Emir', email: 'sjkjdfnksdf', age: 15 }
]
let comments = [
  { id: '1', text: 'This is awesome ! i really like it ;) !', author: '2', post: '3' },
  { id: '2', text: 'Nice bro :D !', author: '1', post: '3' },
  { id: '3', text: 'Goooooooooooooooooood', author: '2', post: '1' }
]
const db = { posts, users, comments }

export default db
