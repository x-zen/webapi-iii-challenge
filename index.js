const express = require('express'); // import the express package

const apiRouter = require('./Routes/api/apiRouter'); // import the post endpoints

const server = express(); // creates the server

server.use(express.json()); // add this to make POST and PUT work


// handle request to the root of the API
server.get('/', (req, res) => {
  res.send('Welcome to The Node Blog API | By: x-zen');
});

// assigns the route for api endpoints
server.use('/api', apiRouter);


// watch for connections on port 3000
server.listen(5000, () =>
  console.log('\n** Server running on http://localhost:5000 **')
);
