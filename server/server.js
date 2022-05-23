const express = require('express');
// implement apollo server
const {ApolloServer} = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// import typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// create Apollo server and pass in the schema data 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})
// integrate Apollo server w express app as middleware
server.applyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}('*', (req,res) => {
  res.sendFile(path.join(__dirname,'../client/build/index.html'));
});

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception:' + err);
});


