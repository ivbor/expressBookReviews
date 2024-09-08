const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let is_logged = Object.values(req.sessionStore.sessions).length;
    if(0 < is_logged) {
        return res.status(208).send("User is logged in already");
    }
    const username = req.query.username;
    const password = req.query.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).send(`"Error logging in. Tried username is ${username} and password is ${password}"`);
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = { accessToken, username };
        return res.status(200).send(
          `"User successfully logged in, authorization: ${req.session.authorization}"`);
    } else {
        return res.status(208).send("Invalid Login. Check username and password");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    let book = Object.values(books).filter((book) => 
      parseInt(isbn) == parseInt(book.isbn))[0];
    const user = req.user;
    book.reviews = {...book.reviews, [user.data]: review};
    if(Object.keys(book.reviews).includes(user.data)) {
        return res.status(200).send('Changed review successfully');
    } else {
        return res.status(200).send('Added review successfully');
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = Object.values(books).filter((book) => 
      parseInt(isbn) == parseInt(book.isbn))[0];
    const user = req.user;
    if(Object.keys(book.reviews).includes(user.data)) {
        delete book.reviews[user.data];
    } else {
        return res.status(208).send('This user never reviewed this book');
    }
    return res.status(200).send('Review deleted successfully')
});

module.exports.authenticated = regd_users;
module.exports.users = users;
