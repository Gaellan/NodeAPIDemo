const { Sequelize, Model, DataTypes } = require("sequelize");
const bcrypt  = require("bcrypt");
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
        try {
            let body = "";
            let id = req.url.split("/")[2];
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                let fields = JSON.parse(body);
                User.findOne(
                    {
                        raw: true,
                        where : {
                            email : fields.email
                        }
                    }
                ).then((caller) => {

                    console.log("I found the user");

                    let plainPassword = fields.password;

                    bcrypt.compare(plainPassword, caller.password)
                        .then(result => {
                            console.log("It's the right password");
                            BookReview.findOne({
                                raw : true,
                                where : {
                                    id : id
                                },
                                include : [
                                    Book,
                                    User
                                ]
                            }).then((review) => {
                                console.log(review);
                                console.log(caller);
                                if(review['user.id'] === caller.id)
                                {
                                    BookReview.update({
                                        title: fields.title,
                                        content : fields.content,
                                        stars : fields.stars,
                                    }, {
                                        where : {
                                            id : id
                                        }
                                    }).then((data) => {
                                        res.writeHead(200, { "Content-Type": "application/json" });
                                        res.end(JSON.stringify(data));
                                    });
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err)
                        });
                });

            });
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error));
        }
    })();
}