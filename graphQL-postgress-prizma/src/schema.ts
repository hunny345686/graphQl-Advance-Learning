import { prisma } from "./lib/prisma.ts";

const typeDefs = `#graphql
  type User {
    email: String!
    id: ID!
    name: String
    posts: [Post!]!
  }
    
  type Post {
    content: String
    id: ID!
    published: Boolean!
    title: String!
    author: User
  }

  type Query {
    feed: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(data: UserCreateInput!): User!
    createDraft(authorEmail: String, content: String, title: String!): Post!
    publish(id: ID!): Post
  }

  input UserCreateInput {
    email: String!
    name: String
    posts: [PostCreateWithoutAuthorInput!]
  }

  input PostCreateWithoutAuthorInput {
    content: String
    published: Boolean
    title: String!
  }

`;

const resolvers = {
    Query: {
        feed: (parent: undefined, args: undefined, context: { token?: string }) => {
            console.log("Token:", context.token);
            return prisma.post.findMany({
                where: { published: true },
            });
        },
        post: (parent: undefined, args: { id: string }) => {
            return prisma.post.findUnique({
                where: { id: Number(args.id) },
            });
        },
    },
    Mutation: {
        createDraft: (parent: undefined, args: { title: string; content: string; authorEmail: string; }) => {
            return prisma.post.create({
                data: {
                    title: args.title,
                    content: args.content,
                    published: false,
                    ...(args.authorEmail && {
                        author: {
                            connect: { email: args.authorEmail },
                        },
                    }),
                },
            })
        },
        publish: (parent: undefined, args: { id: string; }) => {
            return prisma.post.update({
                where: { id: Number(args.id) },
                data: {
                    published: true,
                },
            })
        },
        createUser: (parent: undefined, args: { data: { email: string; name: string; posts: Array<{ title: string; content?: string; published?: boolean; }>; }; }) => {
            return prisma.user.create({
                data: {
                    email: args.data.email,
                    name: args.data.name,
                    posts: {
                        create: args.data.posts,
                    },
                },
            })
        },
    },

    User: {
        posts: (parent: { id: string; }) => {
            return prisma.user
                .findUnique({
                    where: { id: Number(parent.id) },
                })
                .posts()
        },
    },
    Post: {
        author: (parent: { id: string; }) => {
            return prisma.post
                .findUnique({
                    where: { id: Number(parent.id) },
                })
                .author()
        },
    },
};

export { typeDefs, resolvers };