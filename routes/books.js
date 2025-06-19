const express = require('express');
const books = require('../books.json');
const auth = require('../middleware/auth');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => res.json(books));

router.get('/isbn/:isbn', (req, res) => res.json(books[req.params.isbn] || {}));

router.get('/author/:author', (req, res) => {
  const result = Object.values(books).filter(book => book.author === req.params.author);
  res.json(result);
});

router.get('/title/:title', (req, res) => {
  const result = Object.values(books).filter(book => book.title === req.params.title);
  res.json(result);
});

router.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  res.json(book ? book.reviews : {});
});

router.put('/review/:isbn', auth, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;
  books[isbn].reviews[username] = review;
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
  res.send('Review added/modified.');
});

router.delete('/review/:isbn', auth, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;
  delete books[isbn].reviews[username];
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
  res.send('Review deleted.');
});

module.exports = router;
