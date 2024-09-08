const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: `"Unable to register user 
      with username ${username} and  password ${password}."`});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let to_send = await res.send(books);
  return to_send;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let to_send = new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter((book) => (parseInt(book.isbn) == parseInt(req.params.isbn)));
    resolve(filtered_books);
    reject('error');
  });
  to_send.then((data) => {return res.send(data);}).catch((err) => console.log(err));
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let to_send = new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter((book) => (book.author == req.params.author));
    resolve(filtered_books);
    reject('error');
  });
  to_send.then((data) => {return res.send(data);}).catch((err) => console.log(err));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let to_send = new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter((book) => (book.title == req.params.title));
    resolve(filtered_books);
    reject('error');
  });
  to_send.then((data) => {return res.send(data);}).catch((err) => console.log(err));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let to_send = new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter((book) => (parseInt(book.isbn) == parseInt(req.params.isbn)));
    resolve(filtered_books[0]);
    reject('error');
  });
  to_send.then((data) => {
    console.log(data);
    console.log(data.reviews);
    return res.send(data.reviews);}).catch((err) => console.log(err));
});

module.exports.general = public_users;
