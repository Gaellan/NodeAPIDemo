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
        role : {
            type : DataTypes.TEXT,
            defaultValue : "USER"
        }
    });

    Book.hasMany(User);
    User.belongsTo(Book);

    (async () => {
        await sequelize.sync({ force: false });
        try {
            User.findAll(
                {
                    raw: true,
                    include: Book
                }).then((data) => {
                    let items = [];
                    for(let i = 0; i < data.length; i++)
                    {
                        items.push({
                            id : data[i].id,
                            firstName : data[i].firstName,
                            lastName : data[i].lastName,
                            email : data[i].email,
                            password : data[i].password,
                            role : data[i].role,
                            favoriteBook : {
                                id : data[i]['book.id'],
                                title : data[i]['book.title'],
                                description : data[i]['book.description'],
                                publishedYear : data[i]['book.publishedYear'],
                                author : data[i]['book.author'],
                            }
                        });
                    }
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(items));
            });
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error));
        }
    })();
}