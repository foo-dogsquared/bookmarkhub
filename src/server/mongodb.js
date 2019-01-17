const {MongoClient} = require("mongodb");

const mongodb_client = new MongoClient(process.env.MONGODB_URL);

function insert_documents(db, collection_name) {
    const collection = db.collection(collection_name);

    collection.insertOne({"name": "John Does", "age": 40});
} 

module.exports = {
    insert_documents,
    mongodb_client
}