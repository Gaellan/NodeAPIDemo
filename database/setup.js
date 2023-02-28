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

    (async () => {
        await sequelize.sync({ force: false });
        checkRoute(req, res);
    })();
}