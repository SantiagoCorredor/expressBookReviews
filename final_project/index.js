const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    // Check if the user is logged in and has a valid access token
    console.log("Middleware reached!");  // Asegúrate de que esto se imprima
    console.log("Session:", req.session); // Imprime la sesión
    if (req.session.authorization && req.session.authorization.accessToken) {
    console.log("token provided");
    const accessToken = req.session.authorization.accessToken;

    // Verify the JWT token
    jwt.verify(accessToken, "your_secret_key", (err, decodedToken) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid token" });
      }
      
      // Attach the decoded token to the request object for use in subsequent middleware
      req.user = decodedToken;
      console.log("Decoded token:", req.user); 
      next();
    });
  } else {
    console.log("No token in session"); 
    return res.status(401).json({ message: "Unauthorized" });
  }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
