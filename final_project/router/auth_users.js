const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, 'tu_clave_secreta', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Guardamos el usuario en el request
    next();
  });
}

// Validar si el usuario ya existe
const isValid = (username) => {
  return !users.find(user => user.username === username);
};

// Verificar si el usuario y contraseña son correctos
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user || null; // Devuelve el usuario si existe o null si no
};

// Login de usuarios registrados
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = authenticatedUser(username, password);
  if (user) {
    const token = jwt.sign({ username: user.username }, "your_secret_key" , { expiresIn: '1h' });
    // Almacenar el token en la sesión
    req.session.authorization = {
      accessToken: token,
    };
    return res.status(200).json({ token, message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Añadir una reseña a un libro (solo para usuarios autenticados)
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const { rating, comment } = req.body;
  const { isbn } = req.params;  // `isbn` en este caso es el ID del libro
  const username = req.user.username; // Extraemos el username del token

  try {
    // Verificar que el libro existe utilizando el ID
    const book = books[isbn]; // Acceder al libro directamente por su ID

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Crear la reseña
    const newReview = {
      user: username,
      rating,
      comment,
      createdAt: new Date(),
    };

    // Agregar la reseña al libro
    book.reviews[username] = newReview; // Agregamos la reseña usando el nombre de usuario como clave

    return res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding review" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
