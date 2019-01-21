const server = require("./src/app");

const port = 8989 || process.env.PORT;

server.listen(port, function() {
    console.log(`Listening to port ${port}`);
});