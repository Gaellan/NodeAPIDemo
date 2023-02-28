const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect : "sqlite",
    storage : "./database.sqlite3"
});

module.exports = function(req,res) {

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
    });

    Book.hasMany(User);
    User.belongsTo(Book);

    (async () => {
        await sequelize.sync({ force: false });
        try {
            let body = "";

            // Listen for data event
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            // Listen for end event
            req.on("end", async () => {
                let userData = JSON.parse(body);

                Book.findAll(
                    {
                        raw: true,
                        where : {
                            title : userData.favoriteBook.title,
                            publishedYear : userData.favoriteBook.publishedYear,
                            author : userData.favoriteBook.author
                        }
                    }).then((data) => {
                        if(data.length === 0)
                        {
                            Book.create({
                                title : userData.favoriteBook.title,
                                publishedYear : userData.favoriteBook.publishedYear,
                                author : userData.favoriteBook.author,
                                description : userData.favoriteBook.description
                            }).then((data) => {

                                Book.findAll({
                                    raw: true,
                                    where : {
                                        title : userData.favoriteBook.title,
                                        publishedYear : userData.favoriteBook.publishedYear,
                                        author : userData.favoriteBook.author
                                    }
                                }).then((data) => {
                                    userData.bookId = data[0].id;
                                    User.create(userData).then((data) => {

                                        User.findAll({ raw: true }).then((data) => {
                                            res.writeHead(200, { "Content-Type": "application/json" });
                                            res.end(JSON.stringify(data));
                                        });
                                    });
                                });
                            });
                        }
                        else
                        {
                            userData.bookId = data[0].id;
                            User.create(userData).then((data) => {

                                User.findAll({ raw: true }).then((data) => {
                                    res.writeHead(200, { "Content-Type": "application/json" });
                                    res.end(JSON.stringify(data));
                                });
                            });
                        }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(data));
                });
            });
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error));
        }
    })();
}