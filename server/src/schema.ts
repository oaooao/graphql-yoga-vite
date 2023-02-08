import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    feed: [Link!]!
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
 
// 2
const links: Link[] = [
  {
    id: 'link-0',
    url: 'https://graphql-yoga.com',
    description: 'The easiest way of setting up a GraphQL server'
  }
]
 
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 3
    feed: () => links
  },
  // 4
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url
  }
}

export const schema = makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers
})
