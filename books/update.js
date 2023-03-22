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
            let body = "";
            let id = req.url.split("/")[2];
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                let fields = JSON.parse(body);
                console.log(fields);
                Book.update(fields, {
                    where : {
                        id : id
                    }
                }).then((data) => {
                    console.log(data);
                    res.setHeader('Access-Control-Allow-Origin', '*');
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