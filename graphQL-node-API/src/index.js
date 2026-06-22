import express from 'express';

import { graphqlHTTP } from 'express-graphql';
import { schema } from '../schema/schema.js';

const app = express();


app.use('/', graphqlHTTP({
    schema, // You need to define your GraphQL schema here
    graphiql: true, // Enable GraphiQL UI for testing
}));

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});