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

                if(fields.email === fields.callerEmail)
                {
                    console.log("I am updating myself\n");
                    User.findOne(
                        {
                            raw: true,
                            where : {
                                email : fields.email
                            }
                        }
                    ).then((caller) => {

                        let plainPassword = fields.callerPassword;

                        bcrypt.compare(plainPassword, caller.password)
                            .then(result => {
                                User.update({ firstName : fields.firstName, lastName : fields.lastName}, {
                                    where : {
                                        id : id
                                    }
                                }).then((data) => {
                                    console.log(data);
                                    res.writeHead(200, { "Content-Type": "application/json" });
                                    res.end(JSON.stringify(data));
                                });
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    });
                }
                else
                {
                    console.log("I am updating someone else");
                    // retrieve the caller user in database from its email
                    User.findOne(
                        {
                            raw: true,
                            where : {
                                email : fields.callerEmail
                            }
                        }
                    ).then((caller) => {

                        let plainPassword = fields.callerPassword;

                        bcrypt.compare(plainPassword, caller.password)
                            .then(result => {

                                if(caller.role === "ADMIN")
                                {
                                    User.update({ firstName : fields.firstName, lastName : fields.lastName}, {
                                        where : {
                                            id : id
                                        }
                                    }).then((data) => {
                                        console.log(data);
                                        res.writeHead(200, { "Content-Type": "application/json" });
                                        res.end(JSON.stringify(data));
                                    });
                                }
                                else
                                {
                                    res.writeHead(403, { "Content-Type": "application/json" });
                                    res.end(JSON.stringify("You do not have enough privileges to update another user"));
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            });
                    });
                }
            });
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error));
        }
    })();
}