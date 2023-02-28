const createBook = require("./books/create.js");
const readAllBooks = require("./books/readAll.js");
const readOneBook = require("./books/readOne.js");
const updateBook = require("./books/update.js");
const deleteBook = require("./books/delete.js");

const createUser = require("./users/create.js");
const readAllUsers = require("./users/readAll.js");
const readOneUser = require("./users/readOne.js");
const updateUser = require("./users/update.js");
const deleteUser = require("./users/delete.js");
const promoteUser = require("./users/promote.js");

module.exports = function(req, res) {
    if(req.url === "/books" && req.method === "POST") {
        // create a book
        createBook(req, res);
    }
    else if(req.url === "/books" && req.method === "GET") {
        // get all books
        readAllBooks(req, res);
    }
    else if (req.url.match(/\/books\/\d+/) && req.method === "GET") {
        // get the book with the specified id
        readOneBook(req, res);
    }
    else if (req.url.match(/\/books\/\d+/) && req.method === "PUT") {
        // update the book with the specified id
        updateBook(req, res);
    }
    else if (req.url.match(/\/books\/\d+/) && req.method === "DELETE") {
        // delete the book with the specified id
        deleteBook(req, res);
    }
    else if(req.url === "/users" && req.method === "POST") {
        // create a user
        createUser(req, res);
    }
    else if(req.url === "/users" && req.method === "GET") {
        // get all users
        readAllUsers(req, res);
    }
    else if (req.url.match(/\/users\/\d+/) && req.method === "GET") {
        // get the user with the specified id
        readOneUser(req, res);
    }
    else if (req.url.match(/\/users\/\d+/) && req.method === "PUT") {
        // update the user with the specified id
        updateUser(req, res);
    }
    else if (req.url.match(/\/users\/\d+/) && req.method === "DELETE") {
        // delete the user with the specified id
        deleteUser(req, res);
    }
    else if (req.url.match(/^\/users\/\d+\/promote$/) && req.method === "POST") {
        // delete the user with the specified id
        promoteUser(req, res);
    }
}