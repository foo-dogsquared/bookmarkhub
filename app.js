const server = require("./src/server/");

const port = 3000 || process.env.PORT;

server.listen(port);