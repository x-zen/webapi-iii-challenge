const express = require('express'); // import the express package

//const usersRouter = require('./users/usersRouter'); // import the user endpoints
//const postsRouter = require('./posts/postsRouter'); // import the post endpoints

const router = express.Router(); // creates the route


// handle request to the /api endpoint
router.get('/', (req, res) => {
  const d = Date();
  const now = d.toString();
  res.send('Node Blog API | By: x-zen | It is currently '+ now);
});

// assigns the route for user endpoints
//router.use('/users', usersRouter);

// assigns the route for post endpoints
//router.use('/posts', postsRouter);


module.exports = router; // exports the route
