import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLContext } from './context';

const typeDefs = /* GraphQL */ `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    postLink(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`

// 1
type Link = {
  id: string
  url: string
  description: string
}
 
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 3
    feed: (parent: unknown, args: {}, context: GraphQLContext) =>  context.prisma.link.findMany()
  },
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url
  },
  Mutation: {
    postLink: (parent: unknown, args: { description: string; url: string }, context: GraphQLContext) => {
      const newLink = context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        },
      });
      return newLink;
    }
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
