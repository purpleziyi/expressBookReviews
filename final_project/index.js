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
if(!req.header.authorization){
    return res.status(404).json({ message: 'Unauthorized' });  
}

const token = req.headers.authorization;

try {
    const decodedToken = jwt.verify(token, 'your_secret_key_here');
    req.username = decodedToken.username; // Attach username to request object
    next();
   } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
}

});
 
const PORT =5000;

// Registered user routes
app.use("/customer", customer_routes);

// General routes
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
