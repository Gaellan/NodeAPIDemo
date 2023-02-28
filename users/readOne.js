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
            let id = req.url.split("/")[2];

            User.findOne(
                {
                    raw: true,
                    where : {
                        id : id
                    },
                    include: Book
                }
            ).then((data) => {

                let item = {
                    id : data.id,
                    firstName : data.firstName,
                    lastName : data.lastName,
                    email : data.email,
                    password : data.password,
                    favoriteBook : {
                        id : data['book.id'],
                        title : data['book.title'],
                        description : data['book.description'],
                        publishedYear : data['book.publishedYear'],
                        author : data['book.author'],
                    }
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(item));
            });
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error));
        }
    })();
}