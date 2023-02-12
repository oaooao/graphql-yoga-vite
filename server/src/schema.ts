import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";

const typeDefs = /* GraphQL */ `
  type Query {
    info: String!
    feed: [Link!]!
    comment(id: ID): Comment
    link(id: ID): Link
  }

  type Mutation {
    postLink(url: String!, description: String!): Link!
    postCommentOnLink(linkId: ID!, body: String!): Comment!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    body: String!
    link: Link
  }
`;

// 1
type Link = {
  id: string;
  url: string;
  description: string;
};

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 3
    feed: (parent: unknown, args: {}, context: GraphQLContext) =>
      context.prisma.link.findMany(),
    async comment(
      parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) {
      const comment = await context.prisma.comment.findUnique({
        where: {
          id: parseInt(args.id),
        },
      });

      const link = comment?.linkId
        ? await context.prisma.link.findUnique({
            where: {
              id: comment.linkId,
            },
          })
        : null;

      return { ...comment, link };
    },
    async link(parent: unknown, args: { id: string }, context: GraphQLContext) {
      const link = await context.prisma.link.findUnique({
        where: {
          id: parseInt(args.id),
        },
      });

      const comments = link?.id
        ? await context.prisma.comment.findMany({
            where: {
              linkId: link.id,
            },
          })
        : null;

      return { ...link, comments };
    }
  },
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
    comments: (parent: Link, args: {}, context: GraphQLContext) =>
      context.prisma.comment.findMany({
        where: {
          linkId: parseInt(parent.id),
        },
      }),
  },
  Mutation: {
    postLink: (
      parent: unknown,
      args: { description: string; url: string },
      context: GraphQLContext
    ) => {
      const newLink = context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        },
      });
      return newLink;
    },
    async postCommentOnLink(
      parent: unknown,
      args: { linkId: string; body: string },
      context: GraphQLContext
    ) {
      const newComment = await context.prisma.comment.create({
        data: {
          body: args.body,
          linkId: parseInt(args.linkId),
        },
      });
      return newComment;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
