// const express = require('express');
// // implement apollo server
// const {ApolloServer} = require('apollo-server-express');
// const { authMiddleware } = require('./utils/auth');

// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');
// // import typeDefs and resolvers
// const {typeDefs, resolvers} = require('./schemas');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // create Apollo server and pass in the schema data 
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: authMiddleware
// })
// // integrate Apollo server w express app as middleware
// server.applyMiddleware({app});

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }('*', (req,res) => {
//   res.sendFile(path.join(__dirname,'../client/build/index.html'));
// });

// // app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// process.on('uncaughtException', function(err) {
//   console.log('Caught exception:' + err);
// });

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});
// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client= {client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
