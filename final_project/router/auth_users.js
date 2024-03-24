const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'userZZ', password: 'passwordzz' },
];

const isValid = (username)=>{ //returns boolean
   return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
   return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // Generate a JWT token and send it in response
    const token = jwt.sign({ username }, 'your_secret_key_here');
    return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
  
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'your_secret_key_here');
  
    const username = decodedToken.username;
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    if (!review) {
      return res.status(400).json({ message: 'Review is required' });
    }
  
    if (book.reviews[username]) {
      // Modify existing review
      book.reviews[username].review = review;
    } else {
      // Add new review
      book.reviews[username] = { username, review };
    }
    console.log("New review after addition:", book.reviews[username]);
    return res.status(201).json({ message: 'Review added/modified successfully' });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'your_secret_key_here');
  
    const username = decodedToken.username;
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Check if the book has reviews
    if (!book.reviews) {
      return res.status(404).json({ message: 'No reviews found for this book' });
    }
  
    // Delete the user's review
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Review not found for this user' });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
