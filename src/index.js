import { GraphQLServer } from 'graphql-yoga'
import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context (request) {
    return {
      prisma,
      request
    }
  },
  fragmentReplacements
})
server.start(({ port }) => {
  console.log(`Server started at http://localhost:${port}`)
})
