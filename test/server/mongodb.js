const dotenv = require("dotenv").config();
const {MongoClient} = require("mongodb");

MongoClient.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, function(err, client) {
    if (err) throw err;
    console.log("Successfully connected to database");
    const db = client.db("test_db");
    const collection = db.collection("test_collection");

    const results = collection.find({"age": {$lt: 40}}).toArray(function(err, result) {
        if (err) throw err;
        for (const item of result) console.log(item);
    });
    console.log(results);
    client.close();
});