const server = require("./src/app");

const port = 3000 || process.env.PORT;

server.listen(port, function() {
    console.log(`Listening to port ${port}`);
});