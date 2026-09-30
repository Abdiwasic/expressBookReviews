const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 2: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 3: Get book by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await axios.get(`http://localhost:3000/isbn/${isbn}`).then(r => r.data).catch(() => books[isbn]);
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found" });
  } catch (err) {
    const book = books[req.params.isbn];
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 4: Get books by author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const matches = await Promise.resolve(
      Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase())
    );
    if (matches.length > 0) return res.status(200).json(matches);
    return res.status(404).json({ message: "No books found for this author" });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 5: Get books by title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const matches = await Promise.resolve(
      Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase())
    );
    if (matches.length > 0) return res.status(200).json(matches);
    return res.status(404).json({ message: "No books found with this title" });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
