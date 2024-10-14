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
public_users.get('/', async function (req, res) {
  try {
    // Simulamos una operación asíncrona, como podría ser una consulta a una base de datos
    const allBooks = await new Promise((resolve) => {
      resolve(books);
    });

    // Envía la respuesta con los libros
    res.send(JSON.stringify(allBooks, null, 3));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;  // Usar isbn para consistencia

  try {
    // Simulamos una operación asíncrona con una promesa
    const book = await new Promise((resolve, reject) => {
      if (books.hasOwnProperty(isbn)) {
        resolve(books[isbn]);
      } else {
        reject({ message: 'Book not found for ISBN: ' + isbn });
      }
    });

    // Enviar la respuesta con el libro encontrado
    res.send(book);
  } catch (error) {
    // Manejar el error si no se encuentra el libro
    res.status(404).send(error);
  }
});

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = await new Promise((resolve) => {
      let booksByAuthor = [];

      for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
          const book = books[isbn];
          // Check if the author's name matches (case insensitive)
          if (book.author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(book); // Add matching book to the array
          }
        }
      }
      // Resolve the Promise with the matching books
      resolve(booksByAuthor);
    });
    // Send the matching books as a response
    if (matchingBooks.length > 0) {
      res.send(matchingBooks);
    } else {
      // If no books are found, send a 404 status
      res.status(404).send({ message: 'No books found for author: ' + author });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).send({ message: 'Error retrieving books' });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const matchingBooks = await new Promise((resolve) => {
      let booksByTitle = [];
      for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
          const book = books[isbn];
          // Check if the book's title matches (case insensitive)
          if (book.title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(book); // Add matching book to the array
          }
        }
      }
      // Resolve the Promise with the matching books
      resolve(booksByTitle);
    });
    // Send the matching books as a response
    if (matchingBooks.length > 0) {
      res.send(matchingBooks);
    } else {
      // If no books are found, send a 404 status
      res.status(404).send({ message: 'No books found for title: ' + title });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).send({ message: 'Error retrieving books' });
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
