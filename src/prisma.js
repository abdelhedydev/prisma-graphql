import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})
export { prisma as default }

// const updatePostForUser = async (id, data) => {
//   const postExist = await prisma.exists.Post({
//     id
//   })
//   if (!postExist) throw new Error('Post does not exist')

//   const post = await prisma.mutation.updatePost({
//     data,
//     where: {
//       id
//     }
//   }, '{ author { id } }')
//   const user = await prisma.query.user({ where: { id: post.author.id } }, '{ id name }')
//   return user
// }

// updatePostForUser('cjqnm7pvu001c0795pk89yliy', { title: 'HAHAHAHHAHAH' })
//   .then(data => console.log('User Info', data))
//   .catch(err => console.log('eroor', err))
