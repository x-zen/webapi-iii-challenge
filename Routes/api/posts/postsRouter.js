/* --- Routes for '/api/posts' --- */
const express = require('express'); // import the express package

const db = require('../../../data/helpers/postDb.js'); // import data helpers

const router = express.Router(); // creates the route


// POST - Creates a post using info sent in request body
router.post('/', (req, res) => {
  const { text, user_id } = req.body;
  const post =  { text, user_id }
  if (!text || !user_id) {
    res.status(400).json({ error: 'Please provide contents for the post.' })
  }
  db
  .insert(post)
  .then(postID => {
    res.status(201).json(postID);
  })
  .catch(err => {
    res.status(500).json({ error: 'There was an error while saving the post to the database.' });
  })
})

// GET - Returns an array of all posts in database
router.get('/', (req, res) => {
  db
  .get()
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    res.status(500).json({ error: 'The posts information could not be retrieved.' });
  })
})

// GET - Returns post with the specified ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db
  .getById(id)
  .then(post => {
    if (post.length === 0) {
      res.status(404).json({ error: 'The post with the specified ID does not exist.'});
      return;
    }
    res.status(200).json(post);
  })
  .catch(err => {
    res.status(500).json({ error: 'The post information could not be retrieved.'});
  })
})

// DELETE - Deletes post with specified ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db
  .remove(id)
  .then(deleted => {
    if (deleted === 0) {
      res.status(404).json({ error: 'The post with the specified ID does not exist.'});
      return;
    }
    res.status(204).end();
  })
  .catch(err => {
    res.status(500).json({ error: 'The post could not be removed.' });
  })
})

// PUT - Updates post with specified ID & returns the moded post
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { text, user_id } = req.body;
  const updates =  { text, user_id };
  if (!text || !user_id) {
    res.status(400).json({ error: 'Please provide title and contents for the post.' });
  }
  db
  .update(id, updates)
  .then(count => {
    if (count > 0) {
      res.status(200).json(updates);
    }
    res.status(404).json({ error: 'The post with the specified ID does not exist.'});
  })
  .catch(err => {
    res.status(500).json({ error: 'The post information could not be modified.' });
  })
})


module.exports = router; // exports the route
