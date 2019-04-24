/* --- Routes for '/api/users' --- */
const express = require('express'); // import the express package

const db = require('../../../data/helpers/userDb.js'); // import data helpers

const router = express.Router(); // creates the route

/* --- Custom Middleware --- */
/*
  RegExp Object Reference

  '/' - empty search pattern
  '\b' - find a match at the beginning or end of a word in a string
  '\w' - find a word character
  '/g' - perform a global match(find all matches)
*/
const makeCaps = name => name.replace(/\b\w/g, x => x.toUpperCase());
const zenUp = (req, res, next) => {
  req.body.name = makeCaps(req.body.name);
  next();
};


// POST - Creates a user using info sent in request body
router.post('/', zenUp, (req, res) => {
  const { name } = req.body;
  const user =  { name }
  if (!name) {
    res.status(400).json({ error: 'Please provide a name for the user.' })
  }
  db
  .insert(user)
  .then(userID => {
    res.status(201).json(userID);
  })
  .catch(err => {
    res.status(500).json({ error: 'There was an error while saving the user to the database.' });
  })
})

// GET - Returns an array of all users in database
router.get('/', (req, res) => {
  db
  .get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    res.status(500).json({ error: 'The users information could not be retrieved.' });
  })
})

// GET - Returns user with the specified ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db
    .getById(id)
    .then(user => {
      if (user.length === 0) {
        res.status(404).json({ error: 'The user with the specified ID does not exist.'});
        return;
      }
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: 'The user information could not be retrieved.'});
    })
})

// GET - Returns an array of all post by user with the specified ID
router.get('/:userId/posts', (req, res) => {
  const { userId } = req.params;
  db
    .getUserPosts(userId)
    .then(posts => {
      if (!posts) {
        res.status(404).json({ error: 'Could not find any posts for this user.'});
        return;
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'This users posts could not be retrieved.'});
    })
})

// DELETE - Deletes user with specified ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db
  .remove(id)
  .then(deleted => {
    if (deleted === 0) {
      res.status(404).json({ error: 'The user with the specified ID does not exist.'});
      return;
    }
    res.status(204).end();
  })
  .catch(err => {
    res.status(500).json({ error: 'The post could not be removed.' });
  })
})

// PUT - Updates user with specified ID & returns the moded user
router.put('/:id', zenUp, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updates =  { name };
  if (!name) {
    res.status(400).json({ error: 'Please provide a name for the user.' });
  }
  db
  .update(id, updates)
  .then(count => {
    if (count > 0) {
      res.status(200).json(updates);
    }
    res.status(404).json({ error: 'The user with the specified ID does not exist.'});
  })
  .catch(err => {
    res.status(500).json({ error: 'The user information could not be modified.' });
  })
})


module.exports = router; // exports the route
