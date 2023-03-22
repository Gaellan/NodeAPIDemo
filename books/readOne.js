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

    (async () => {
        await sequelize.sync({ force: false });
        try {
            let id = req.url.split("/")[2];

            Book.findAll(
                {
                    raw: true,
                    where : {
                        id : id
                    }
            }
            ).then((data) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(data));
            });
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify(error));
        }
    })();
}