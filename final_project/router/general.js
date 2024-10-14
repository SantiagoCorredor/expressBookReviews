const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Validar los datos del usuario (opcional pero recomendado)
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Crear un nuevo usuario
  const newUser = {
    username,
    password
  };

  // Agregar el nuevo usuario al array de usuarios
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;  // Use isbn for consistency

  // Check if ISBN exists in the books object
  if (books.hasOwnProperty(isbn)) {
    res.send(books[isbn]);
  } else {
    res.status(404).send({ message: 'Book not found for ISBN: ' + isbn });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  // Iterate through the book objects
  let matchingBooks = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.author.toLowerCase() === author.toLowerCase())   
 {
        matchingBooks.push(book);
      }
    }
  }

  // Check if any books found for the author
  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send({ message: 'No books found for author: ' + author });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  // Iterate through the book objects
  let matchingBooks = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title.toLowerCase() === title.toLowerCase())   
 {
        matchingBooks.push(book);
      }
    }
  }

  // Check if any books found for the title
  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send({ message: 'No books found for title: ' + title });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;  // Use isbn for consistenc

  // Check if ISBN exists in the books object
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    res.send(book.reviews);
  } else {
    res.status(404).send({ message: 'Nor reviws found for ISBN: ' + isbn });
  }
});

module.exports.general = public_users;
