const createBook = require("./books/create.js")
const readAllBooks = require("./books/readAll.js");
const readOneBook = require("./books/readOne.js");
const updateBook = require("./books/update.js");
const deleteBook = require("./books/delete.js");

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
}