import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefinitions = /* GraphQL */ `
  type Query {
    hello: String!
  }
`

const resolvers = {
    Query: {
        hello: () => "Hello World"
    }
}

export const schema = makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers
})
