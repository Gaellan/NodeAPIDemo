const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect : "sqlite",
    storage : "./database.sqlite3"
});
const checkRoute = require('../routing.js');

module.exports = function(req, res) {
    const Book = sequelize.define("book", {
        title: DataTypes.TEXT,
        description: DataTypes.TEXT,
        publishedYear: DataTypes.INTEGER,
        author: DataTypes.TEXT
    });

    const User = sequelize.define("user", {
        firstName : DataTypes.TEXT,
        lastName : DataTypes.TEXT,
        email : DataTypes.TEXT,
        password : DataTypes.TEXT,
        role : {
            type : DataTypes.TEXT,
            defaultValue : "USER"
        }
    });

    const BookReview = sequelize.define("book_review", {
        title : DataTypes.TEXT,
        content : DataTypes.TEXT,
        stars : DataTypes.INTEGER
    });

    Book.hasMany(BookReview);
    BookReview.belongsTo(Book);
    User.hasMany(BookReview);
    BookReview.belongsTo(User);
    Book.hasMany(User);
    User.belongsTo(Book);

    (async () => {
        await sequelize.sync({ force: false });
        checkRoute(req, res);
    })();
}