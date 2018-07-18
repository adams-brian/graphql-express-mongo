import * as http from 'http';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { connect, connection } from 'mongoose';
import * as cors from 'cors';

import schema from './graphql/schema';

const port = process.env.PORT || '4000';

connect('mongodb://localhost:27017');
connection.once('open', () => { console.log('mongoose connected to database'); });

const server = express();

// CORS
server.use(cors());

// Routes
const router = express.Router();
router.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));
router.use('*', (req, res) => {
  res.send('<h1>The GraphQL endpoint is located at /graphql</h1>');
})
server.use('/', router);

http.createServer(server).listen(port, () => console.log(`Running on localhost:${port}`));
