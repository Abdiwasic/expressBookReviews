const express = require('express');
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

// Task 2: Get all books (async/await)
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve) => resolve(books));
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 3: Get book by ISBN (async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      const found = books[isbn];
      if (found) resolve(found);
      else reject(new Error("Book not found"));
    });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 4: Get books by author (async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const result = await new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(
        b => b.author.toLowerCase() === author.toLowerCase()
      );
      if (matches.length > 0) resolve(matches);
      else reject(new Error("No books found for this author"));
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 5: Get books by title (async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const result = await new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(
        b => b.title.toLowerCase() === title.toLowerCase()
      );
      if (matches.length > 0) resolve(matches);
      else reject(new Error("No books found with this title"));
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
