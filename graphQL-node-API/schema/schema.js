import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";


// Define the GraphQL schema
const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hello: {
            type: GraphQLString,
            resolve() {
                return 'Hello from GraphQL!';
            }
        }
    }
})

export const schema = new GraphQLSchema({
    query: rootQuery
});