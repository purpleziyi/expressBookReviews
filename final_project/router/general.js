const express = require('express');   // use Express framework
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();  // create instance of route


public_users.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }
  
    const newUser = { username, password };
    users.push(newUser);
  
    return res.status(201).json({ message: 'User registered successfully', data: newUser });
  });
  

  public_users.get('/', async (req, res) => {
    try {
      return res.status(200).json({ message: books });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books.hasOwnProperty(isbn)) {
        resolve(books[isbn]);
      } else {
        reject(new Error('Book not found'));
      }
  }).then(
    book => {
    return res.status(200).json({ message: 'Book retrieved successfully', data: book });
    }).catch(error => {
        return res.status(404).json({ message: 'Book not found' });  
    });
 });

 // task 11
//  public_users.get('/isbn/:isbn', async (req, res) => {
//     try {
//         const isbn = req.params.isbn;
//         const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
//         res.status(200).json({ message: response.data });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  try {
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId) && books[bookId].author === author) {
        matchingBooks.push({ id: bookId, ...books[bookId] });
      }
    }

    if (matchingBooks.length > 0) {
      return res.status(200).json({ message: 'Books retrieved successfully', data: matchingBooks });
    } else {
      return res.status(404).json({ message: 'No books found for the author' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }

});

// task 12
// public_users.get('/author/:author', (req, res) => {
//     const author = req.params.author;
//     const matchingBooks = [];

//     // Promisified function to get books
//     const getBooks = () => {
//         return new Promise((resolve, reject) => {
//             try {
//                 for (const bookId in books) {
//                     if (books.hasOwnProperty(bookId) && books[bookId].author === author) {
//                         matchingBooks.push({ id: bookId, ...books[bookId] });
//                     }
//                 }

//                 if (matchingBooks.length > 0) {
//                     resolve(matchingBooks);
//                 } else {
//                     reject(new Error('No books found for the author'));
//                 }
//             } catch (error) {
//                 reject(new Error('Internal server error'));
//             }
//         });
//     };

//     // Using Promise callbacks
//     getBooks()
//         .then(matchingBooks => {
//             res.status(200).json({ message: 'Books retrieved successfully', data: matchingBooks });
//         })
//         .catch(error => {
//             if (error.message === 'No books found for the author') {
//                 res.status(404).json({ message: error.message });
//             } else {
//                 res.status(500).json({ message: error.message });
//             }
//         });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  try{
    for(const bookId in books){
        if(books.hasOwnProperty(bookId) && books[bookId].title === title){
            matchingBooks.push({id: bookId, ...books[bookId]});
        }
    }
    if(matchingBooks.length > 0){
        return res.status(200).json({ message: 'Books retrieved successfully', data: matchingBooks });
    } else {
        return res.status(404).json({message : 'No books found for the title'})
    } 
    }catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
});

//task 13
// public_users.get('/title/:title', async (req, res) => {
//     try {
//         const title = req.params.title;
//         const response = await axios.get(`http://localhost:5000/title/${title}`);
//         res.status(200).json({ message: response.data });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

  try {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      const review = book.reviews;
      return res.status(200).json({ message: 'Review retrieved successfully', data: review });
    } else {
      return res.status(404).json({ message: 'Book/Review not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports.general = public_users;
